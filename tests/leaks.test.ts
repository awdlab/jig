import test, { expect } from '@playwright/test';

const ITERATIONS = 10; // Number of times to load and destroy components

// This test suite relies on the Chrome DevTools Protocol (CDP), which is only available in Chromium.
test.skip(({ browserName }) => browserName !== 'chromium', 'CDP only available in Chromium');

/**
 * Memory leak detection test for all components.
 *
 * This test loads and destroys all NGneers components multiple times, then uses
 * Chrome DevTools Protocol to force garbage collection and check for memory leaks.
 *
 * Implementation:
 * - Loads all components via the /leaks route
 * - Toggles component visibility multiple times (controlled by ITERATIONS const)
 * - Forces garbage collection via CDP
 * - Takes a heap snapshot via CDP
 * - Parses the heap snapshot to detect component class instances still in memory
 * - Fails the test if any component class instances are found after GC
 *
 * How it works:
 * - Uses CDP HeapProfiler.addHeapSnapshotChunk events to collect snapshot data
 * - Parses the snapshot JSON structure to iterate through all heap nodes
 * - Searches for component class names in the strings array
 * - Reports any found component instances as potential memory leaks
 *
 * Note: This test only runs on Chromium since CDP is required.
 */
test('Memory leak detection for all components', async ({ page, browser }) => {
  // Increase test timeout for heap snapshot operations
  test.setTimeout(120000); // 2 minutes

  // Navigate to the leaks test page
  const url = process.env['CI'] ? 'http://localhost:4222/leaks' : 'http://hostmachine:4222/leaks';
  await page.goto(url);

  // Wait for the page to be ready
  await expect(page.locator('ngn-leak-test')).toBeAttached();

  // Get the CDP session for memory operations
  const client = await page.context().newCDPSession(page);

  // Enable heap profiler
  await client.send('HeapProfiler.enable');

  // Component class names to check for leaks
  const componentClassNames = [
    'NgnAccordion',
    'NgnAccordionPanel',
    'NgnAvatar',
    'NgnAvatarGroup',
    'NgnBreadcrumb',
    'NgnButton',
    'NgnButtonGroup',
    'NgnCalendar',
    'NgnCheckbox',
    'NgnChip',
    'NgnDefer',
    'NgnDialog',
    'NgnEditInplace',
    'NgnFilter',
    'NgnIcon',
    'NgnInplace',
    'NgnInput',
    'NgnInputField',
    'NgnInputMask',
    'NgnItemView',
    'NgnListBox',
    'NgnMessage',
    'NgnPopover',
    'NgnScroller',
    'NgnScrollerItem',
    'NgnSelect',
    'NgnSplitter',
    'NgnTab',
    'NgnTabs',
    'NgnTable',
    'NgnTag',
    'NgnTooltip',
  ];

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

  // Load and destroy components multiple times
  for (let i = 0; i < ITERATIONS; i++) {
    await test.step(`Iteration ${i + 1}/${ITERATIONS}: Load and destroy components`, async () => {
      // Show components
      await page.evaluate(() => {
        const component = (window as any).__leak_test_component;
        if (component && component.setShow) {
          component.setShow(true);
        }
      });

      // Wait for components to render
      await page.waitForTimeout(100);

      // Hide/destroy components
      await page.evaluate(() => {
        const component = (window as any).__leak_test_component;
        if (component && component.setShow) {
          component.setShow(false);
        }
      });

      // Wait for components to be destroyed
      await page.waitForTimeout(100);
    });
  }

  // Force garbage collection
  await test.step('Force garbage collection', async () => {
    await client.send('HeapProfiler.collectGarbage');
    // Wait a bit after GC
    await page.waitForTimeout(500);
  });

  // Take heap snapshot and check for leaks
  await test.step('Take heap snapshot and check for leaks', async () => {
    // Collect heap snapshot chunks
    const snapshotChunks: string[] = [];

    // Set up event listeners for heap snapshot data
    client.on('HeapProfiler.addHeapSnapshotChunk', (event: any) => {
      snapshotChunks.push(event.chunk);
    });

    // Start taking the heap snapshot
    await client.send('HeapProfiler.takeHeapSnapshot', {
      reportProgress: false,
      captureNumericValue: false,
    });

    // Parse the heap snapshot
    let snapshot: any;
    try {
      const snapshotJson = snapshotChunks.join('');
      snapshot = JSON.parse(snapshotJson);
    } catch (error) {
      console.error('Failed to parse heap snapshot:', error);
      throw new Error('Failed to parse heap snapshot JSON');
    }

    // Parse the snapshot and look for component class instances
    const foundComponents: string[] = [];

    if (
      snapshot &&
      snapshot.nodes &&
      snapshot.strings &&
      snapshot.edges &&
      snapshot.snapshot?.meta
    ) {
      const strings: string[] = snapshot.strings;
      const nodes: number[] = snapshot.nodes;
      const edges: number[] = snapshot.edges;

      const nodeTypes: string[] = snapshot.snapshot.meta.node_types[0]; // First element is type enum
      const nodeFields: string[] = snapshot.snapshot.meta.node_fields;
      const nodeFieldCount = nodeFields.length;
      const typeOffset = nodeFields.indexOf('type');
      const nameOffset = nodeFields.indexOf('name');
      const edgeCountOffset = nodeFields.indexOf('edge_count');

      const edgeFields: string[] = snapshot.snapshot.meta.edge_fields;
      const edgeFieldCount = edgeFields.length;
      const edgeTypes: string[] = snapshot.snapshot.meta.edge_types[0];
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
    }

    // Log results
    console.log(`Completed ${ITERATIONS} iterations of component load/destroy cycles`);
    console.log(`Heap snapshot parsed: ${snapshot ? 'success' : 'failed'}`);
    console.log(
      `Total nodes in heap: ${snapshot?.nodes?.length / snapshot?.snapshot?.meta?.node_fields?.length || 0}`
    );
    console.log(`Component instances found in heap: ${foundComponents.length}`);

    // Report which components were found (potential leaks)
    if (foundComponents.length > 0) {
      const uniqueComponents = [...new Set(foundComponents)];
      console.warn(
        `⚠️  Potential memory leaks detected! Found ${foundComponents.length} instances of component classes still in memory:`
      );
      console.warn(`Unique component classes: ${uniqueComponents.join(', ')}`);
      console.warn(`Total instances: ${foundComponents.length}`);

      // Fail the test if components are still in memory
      expect(
        foundComponents.length,
        `Expected 0 component instances in memory after GC, but found ${foundComponents.length}. ` +
          `Components found: ${uniqueComponents.join(', ')}`
      ).toBe(0);
    } else {
      console.log('✅ No component class instances found in heap after GC');
    }
  });

  // Cleanup
  await client.detach();
});
