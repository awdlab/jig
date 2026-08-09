import type { AwdTreeItem } from '@awdlab/jig/api';

export interface FlatTreeNode<T = any, V = any> {
  item: AwdTreeItem<T, V>;
  /** 0-based depth. */
  level: number;
  /** Number of siblings at this level (aria-setsize). */
  setSize: number;
  /** 1-based position among siblings (aria-posinset). */
  posInSet: number;
  hasChildren: boolean;
  expanded: boolean;
  /** True when an ancestor is disabled (disable cascades to the subtree). */
  parentDisabled: boolean;
}

/** Walk the tree, emitting only expanded + visible nodes as a flat list. */
export function flattenTree<T, V>(
  items: readonly AwdTreeItem<T, V>[],
  expanded: ReadonlySet<V>,
  level = 0,
  parentDisabled = false
): FlatTreeNode<T, V>[] {
  const result: FlatTreeNode<T, V>[] = [];
  const setSize = items.length;
  items.forEach((item, index) => {
    // A lazy branch shows a toggle before its children are loaded.
    const hasChildren = (!!item.items && item.items.length > 0) || !!item.lazy;
    const isExpanded = hasChildren && expanded.has(item.value);
    const effectiveDisabled = parentDisabled || !!item.disabled;
    result.push({
      item,
      level,
      setSize,
      posInSet: index + 1,
      hasChildren,
      expanded: isExpanded,
      parentDisabled,
    });
    if (isExpanded && item.items) {
      result.push(...flattenTree(item.items, expanded, level + 1, effectiveDisabled));
    }
  });
  return result;
}

/**
 * Inject lazily-loaded children (keyed by node value) into the tree, returning
 * a new forest where resolved lazy nodes carry their loaded `items` and are no
 * longer marked `lazy`. Returns the input unchanged when nothing is loaded.
 */
export function applyLoadedChildren<T, V>(
  items: readonly AwdTreeItem<T, V>[],
  loaded: ReadonlyMap<V, readonly AwdTreeItem<T, V>[]>
): readonly AwdTreeItem<T, V>[] {
  if (loaded.size === 0) {
    return items;
  }
  return items.map(item => {
    const cached = loaded.get(item.value);
    if (cached !== undefined) {
      return { ...item, items: [...applyLoadedChildren(cached, loaded)], lazy: false };
    }
    if (item.items && item.items.length > 0) {
      return { ...item, items: [...applyLoadedChildren(item.items, loaded)] };
    }
    return item;
  });
}

/** All selectable, enabled leaf values under (and including) an item. */
export function collectLeafValues<T, V>(item: AwdTreeItem<T, V>, parentDisabled = false): V[] {
  const disabled = parentDisabled || !!item.disabled;
  if (item.items && item.items.length > 0) {
    return item.items.flatMap(child => collectLeafValues(child, disabled));
  }
  if (disabled || item.selectable === false) {
    return [];
  }
  return [item.value];
}

/** All branch values in the forest (used to auto-expand while filtering). */
export function collectBranchValues<T, V>(items: readonly AwdTreeItem<T, V>[]): V[] {
  return items.flatMap(item =>
    item.items && item.items.length > 0 ? [item.value, ...collectBranchValues(item.items)] : []
  );
}

/** Add/remove all of a node's enabled leaf values against the current value set. */
export function cascadeCheck<T, V>(
  node: AwdTreeItem<T, V>,
  shouldCheck: boolean,
  currentValue: readonly V[]
): V[] {
  const leaves = collectLeafValues(node);
  const set = new Set(currentValue);
  for (const value of leaves) {
    if (shouldCheck) {
      set.add(value);
    } else {
      set.delete(value);
    }
  }
  return [...set];
}

/** Derive a node's tri-state from which of its leaves are in the value set. */
export function computeNodeState<T, V>(
  item: AwdTreeItem<T, V>,
  valueSet: ReadonlySet<V>
): 'checked' | 'unchecked' | 'indeterminate' {
  const leaves = collectLeafValues(item);
  if (leaves.length === 0) {
    return 'unchecked';
  }
  let checked = 0;
  for (const value of leaves) {
    if (valueSet.has(value)) {
      checked++;
    }
  }
  if (checked === 0) return 'unchecked';
  if (checked === leaves.length) return 'checked';
  return 'indeterminate';
}
