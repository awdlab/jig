import test, { CDPSession, Page } from '@playwright/test';

type HeapSnapshot = {
  nodes: number[];
  edges: number[];
  strings: string[];
  snapshot: {
    meta: {
      node_types: [string[]];
      node_fields: string[];
      edge_types: [string[]];
      edge_fields: string[];
    };
  };
};

type LeakCheckResult = {
  foundComponents: string[];
  totalNodes: number;
};

function matchesComponentName(nodeName: string, baseName: string): boolean {
  if (nodeName === baseName) {
    return true;
  }
  if (!nodeName.startsWith(baseName)) {
    return false;
  }
  const suffix = nodeName.slice(baseName.length);
  return suffix.length > 0 && /^[0-9]+$/.test(suffix);
}

function findLeakedComponentInstances(
  snapshot: HeapSnapshot,
  componentClassNames: readonly string[]
): LeakCheckResult {
  const strings = snapshot.strings;
  const nodes = snapshot.nodes;
  const edges = snapshot.edges;

  const nodeTypes = snapshot.snapshot.meta.node_types[0];
  const nodeFields = snapshot.snapshot.meta.node_fields;
  const nodeFieldCount = nodeFields.length;
  const typeOffset = nodeFields.indexOf('type');
  const nameOffset = nodeFields.indexOf('name');
  const edgeCountOffset = nodeFields.indexOf('edge_count');

  const edgeFields = snapshot.snapshot.meta.edge_fields;
  const edgeFieldCount = edgeFields.length;
  const edgeTypes = snapshot.snapshot.meta.edge_types[0];
  const edgeTypeOffset = edgeFields.indexOf('type');
  const edgeNameOrIndexOffset = edgeFields.indexOf('name_or_index');
  const edgeToNodeOffset = edgeFields.indexOf('to_node');

  function isPrototypeRelatedIncomingEdge(edgeType: string, edgeName: string | null): boolean {
    // These are the edges that show up in DevTools retainers as "prototype in ..."
    return (
      (edgeType === 'property' && (edgeName === 'prototype' || edgeName === '__proto__')) ||
      (edgeType === 'internal' && edgeName === '[[Prototype]]')
    );
  }

  function hasOwnConstructorProperty(edgeStartIndex: number, edgeCount: number): boolean {
    // Prototype objects (definitions) typically have an own 'constructor' property.
    const edgeEndIndex = edgeStartIndex + edgeCount * edgeFieldCount;
    for (let e = edgeStartIndex; e < edgeEndIndex; e += edgeFieldCount) {
      const edgeType = edgeTypes[edges[e + edgeTypeOffset]];
      if (edgeType !== 'property') {
        continue;
      }
      const nameIndex = edges[e + edgeNameOrIndexOffset];
      const edgeName = strings[nameIndex];
      if (edgeName === 'constructor') {
        return true;
      }
    }
    return false;
  }

  // 1) Collect candidate nodes (object nodes whose constructor name matches a component class)
  //    while excluding obvious prototypes/definitions.
  const candidateOrdinals: number[] = [];
  const candidateNamesByOrdinal = new Map<number, string>();
  const candidateSet = new Set<number>();

  let edgeIndex = 0;
  for (let i = 0; i < nodes.length; i += nodeFieldCount) {
    const typeIndex = nodes[i + typeOffset];
    const nodeType = nodeTypes[typeIndex];
    const nameIndex = nodes[i + nameOffset];
    const nodeName = strings[nameIndex];
    const edgeCount = edgeCountOffset >= 0 ? nodes[i + edgeCountOffset] : 0;

    if (nodeType === 'object') {
      for (const baseName of componentClassNames) {
        if (matchesComponentName(nodeName, baseName)) {
          // Filter out prototypes/definitions (incl. base classes kept due to being extended).
          if (!hasOwnConstructorProperty(edgeIndex, edgeCount)) {
            const ordinal = i / nodeFieldCount;
            candidateOrdinals.push(ordinal);
            candidateNamesByOrdinal.set(ordinal, nodeName);
            candidateSet.add(ordinal);
          }
          break;
        }
      }
    }

    edgeIndex += edgeCount * edgeFieldCount;
  }

  // 2) Filter out nodes that are only retained due to being part of a prototype chain.
  //    This addresses false-positives like a base class prototype being referenced via
  //    "prototype in SomeDerivedCtor()" retainers.
  const incomingProtoCount = new Map<number, number>();
  const incomingOtherCount = new Map<number, number>();

  for (let e = 0; e < edges.length; e += edgeFieldCount) {
    const toNodeIndex = edges[e + edgeToNodeOffset];
    const toOrdinal = toNodeIndex / nodeFieldCount;
    if (!candidateSet.has(toOrdinal)) {
      continue;
    }

    const edgeType = edgeTypes[edges[e + edgeTypeOffset]];
    const rawNameOrIndex = edges[e + edgeNameOrIndexOffset];
    const edgeName =
      edgeType === 'property' || edgeType === 'internal' ? strings[rawNameOrIndex] : null;

    if (isPrototypeRelatedIncomingEdge(edgeType, edgeName)) {
      incomingProtoCount.set(toOrdinal, (incomingProtoCount.get(toOrdinal) ?? 0) + 1);
    } else {
      incomingOtherCount.set(toOrdinal, (incomingOtherCount.get(toOrdinal) ?? 0) + 1);
    }
  }

  const foundComponents: string[] = [];
  for (const ordinal of candidateOrdinals) {
    const proto = incomingProtoCount.get(ordinal) ?? 0;
    const other = incomingOtherCount.get(ordinal) ?? 0;

    // If the only incoming references are prototype-related, it's not a leaked instance.
    if (other === 0 && proto > 0) {
      continue;
    }

    const name = candidateNamesByOrdinal.get(ordinal);
    if (name) {
      foundComponents.push(name);
    }
  }

  return {
    foundComponents,
    totalNodes: nodes.length / nodeFieldCount,
  };
}

export async function forceGcAndCheckForLeaks(params: {
  client: CDPSession;
  page: Pick<Page, 'waitForTimeout'>;
  componentClassNames: readonly string[];
  gcWaitMs?: number;
}): Promise<LeakCheckResult> {
  const { client, page, componentClassNames, gcWaitMs = 500 } = params;

  await test.step('Force garbage collection', async () => {
    await client.send('HeapProfiler.collectGarbage');
    await page.waitForTimeout(gcWaitMs);
  });

  return await test.step('Take heap snapshot and check for leaks', async () => {
    const snapshotChunks: string[] = [];
    client.on('HeapProfiler.addHeapSnapshotChunk', (event: unknown) => {
      const chunk = (event as { chunk?: unknown }).chunk;
      if (typeof chunk === 'string') {
        snapshotChunks.push(chunk);
      }
    });

    await client.send('HeapProfiler.takeHeapSnapshot', {
      reportProgress: false,
      captureNumericValue: false,
    });

    let snapshot: HeapSnapshot;
    try {
      const snapshotJson = snapshotChunks.join('');
      snapshot = JSON.parse(snapshotJson) as HeapSnapshot;
    } catch (error) {
      console.error('Failed to parse heap snapshot:', error);
      throw new Error('Failed to parse heap snapshot JSON');
    }

    if (!snapshot?.nodes || !snapshot?.strings || !snapshot?.edges || !snapshot?.snapshot?.meta) {
      return { foundComponents: [], totalNodes: 0 };
    }

    return findLeakedComponentInstances(snapshot, componentClassNames);
  });
}
