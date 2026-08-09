import { describe, expect, it } from 'vitest';

import {
  applyLoadedChildren,
  cascadeCheck,
  collectBranchValues,
  collectLeafValues,
  computeNodeState,
  flattenTree,
} from './tree-utils';

import type { NgnTreeItem } from '@awdlab/jig/api';

const tree: NgnTreeItem[] = [
  {
    label: 'Fruit',
    value: 'fruit',
    items: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Disabled', value: 'dis', disabled: true },
    ],
  },
  { label: 'Bread', value: 'bread' },
];

describe('flattenTree', () => {
  it('emits only the roots when nothing is expanded', () => {
    const flat = flattenTree(tree, new Set());
    expect(flat.map(n => n.item.value)).toEqual(['fruit', 'bread']);
    expect(flat[0]).toMatchObject({
      level: 0,
      setSize: 2,
      posInSet: 1,
      hasChildren: true,
      expanded: false,
    });
    expect(flat[1]).toMatchObject({ level: 0, posInSet: 2, hasChildren: false });
  });

  it('emits children of expanded branches with level + a11y metadata', () => {
    const flat = flattenTree(tree, new Set(['fruit']));
    expect(flat.map(n => n.item.value)).toEqual(['fruit', 'apple', 'banana', 'dis', 'bread']);
    const apple = flat[1];
    expect(apple).toMatchObject({ level: 1, setSize: 3, posInSet: 1 });
  });

  it('marks descendants of a disabled branch as parentDisabled', () => {
    const disabledBranch: NgnTreeItem[] = [
      { label: 'X', value: 'x', disabled: true, items: [{ label: 'Y', value: 'y' }] },
    ];
    const flat = flattenTree(disabledBranch, new Set(['x']));
    expect(flat[1]).toMatchObject({ item: { value: 'y' }, parentDisabled: true });
  });
});

describe('collectLeafValues', () => {
  it('returns leaf values under a branch, excluding disabled and non-selectable leaves', () => {
    expect(collectLeafValues(tree[0])).toEqual(['apple', 'banana']);
  });

  it('returns the node itself for a leaf', () => {
    expect(collectLeafValues(tree[1])).toEqual(['bread']);
  });

  it('excludes a leaf marked selectable:false', () => {
    const branch: NgnTreeItem = {
      label: 'B',
      value: 'b',
      items: [
        { label: 'a', value: 'a' },
        { label: 'n', value: 'n', selectable: false },
      ],
    };
    expect(collectLeafValues(branch)).toEqual(['a']);
  });

  it('excludes all leaves under a disabled branch', () => {
    const branch: NgnTreeItem = {
      label: 'B',
      value: 'b',
      disabled: true,
      items: [
        { label: 'a', value: 'a' },
        { label: 'c', value: 'c' },
      ],
    };
    expect(collectLeafValues(branch)).toEqual([]);
  });
});

describe('collectBranchValues', () => {
  it('returns every branch value (for filter auto-expand)', () => {
    expect(collectBranchValues(tree)).toEqual(['fruit']);
  });

  it('returns branch values at every depth', () => {
    const nested: NgnTreeItem[] = [
      {
        label: 'A',
        value: 'a',
        items: [{ label: 'B', value: 'b', items: [{ label: 'C', value: 'c' }] }],
      },
    ];
    expect(collectBranchValues(nested)).toEqual(['a', 'b']);
  });
});

describe('cascadeCheck', () => {
  it('adds all enabled leaves of a branch when checking', () => {
    expect(cascadeCheck(tree[0], true, []).sort()).toEqual(['apple', 'banana']);
  });

  it('removes all leaves of a branch when unchecking', () => {
    expect(cascadeCheck(tree[0], false, ['apple', 'banana', 'bread'])).toEqual(['bread']);
  });

  it('toggles a single leaf', () => {
    expect(cascadeCheck(tree[1], true, ['apple'])).toEqual(['apple', 'bread']);
  });
});

describe('computeNodeState', () => {
  it('is unchecked when no leaves selected', () => {
    expect(computeNodeState(tree[0], new Set())).toBe('unchecked');
  });

  it('is indeterminate when some leaves selected', () => {
    expect(computeNodeState(tree[0], new Set(['apple']))).toBe('indeterminate');
  });

  it('is checked when all enabled leaves selected', () => {
    expect(computeNodeState(tree[0], new Set(['apple', 'banana']))).toBe('checked');
  });

  it('reflects a leaf directly', () => {
    expect(computeNodeState(tree[1], new Set(['bread']))).toBe('checked');
  });

  it('ignores leaves under a disabled sub-branch when deriving state', () => {
    const branch: NgnTreeItem = {
      label: 'Root',
      value: 'root',
      items: [
        { label: 'On', value: 'on' },
        { label: 'OffBranch', value: 'offb', disabled: true, items: [{ label: 'x', value: 'x' }] },
      ],
    };
    // only 'on' is an enabled leaf; checking it => fully checked
    expect(computeNodeState(branch, new Set(['on']))).toBe('checked');
  });
});

describe('lazy nodes', () => {
  const lazyTree: NgnTreeItem[] = [
    { label: 'Root A', value: 'a', lazy: true },
    { label: 'Leaf', value: 'leaf' },
  ];

  it('flattenTree treats a lazy node as expandable before load', () => {
    const flat = flattenTree(lazyTree, new Set());
    expect(flat[0]).toMatchObject({ item: { value: 'a' }, hasChildren: true });
    expect(flat[1]).toMatchObject({ item: { value: 'leaf' }, hasChildren: false });
  });

  it('flattenTree shows an expanded lazy node with no rows until children load', () => {
    const flat = flattenTree(lazyTree, new Set(['a']));
    // no loaded children yet => only the two roots
    expect(flat.map(n => n.item.value)).toEqual(['a', 'leaf']);
  });

  it('applyLoadedChildren returns the input unchanged when nothing is loaded', () => {
    expect(applyLoadedChildren(lazyTree, new Map())).toBe(lazyTree);
  });

  it('applyLoadedChildren injects children and clears the lazy flag', () => {
    const loaded = new Map([['a', [{ label: 'A1', value: 'a-1' }]]]);
    const merged = applyLoadedChildren(lazyTree, loaded);
    expect(merged[0]).toMatchObject({ value: 'a', lazy: false });
    expect(merged[0]!.items).toEqual([{ label: 'A1', value: 'a-1' }]);
    // once merged, flatten expands it like a normal branch
    const flat = flattenTree(merged, new Set(['a']));
    expect(flat.map(n => n.item.value)).toEqual(['a', 'a-1', 'leaf']);
  });

  it('applyLoadedChildren merges nested lazy children', () => {
    const loaded = new Map<string, NgnTreeItem[]>([
      ['a', [{ label: 'Sub', value: 'sub', lazy: true }]],
      ['sub', [{ label: 'Deep', value: 'deep' }]],
    ]);
    const merged = applyLoadedChildren(lazyTree, loaded);
    const flat = flattenTree(merged, new Set(['a', 'sub']));
    expect(flat.map(n => n.item.value)).toEqual(['a', 'sub', 'deep', 'leaf']);
  });
});
