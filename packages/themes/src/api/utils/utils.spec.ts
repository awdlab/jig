import { describe, expect, it } from 'vitest';

import { deepMerge } from './deep-merge.js';
import { deepSet } from './deep-set.js';
import { groupArrayUsing } from './group-array-using.js';
import { subKey } from './sub-key.js';

describe('deepSet', () => {
  it('sets a single-segment path on the object itself', () => {
    const target: Record<string, unknown> = {};
    deepSet(target, 'primary', { 50: null });
    expect(target).toEqual({ primary: { 50: null } });
  });

  it('creates the intermediate objects for a nested path', () => {
    const target: Record<string, unknown> = {};
    deepSet(target, 'color.surface.border', 'red');
    expect(target).toEqual({ color: { surface: { border: 'red' } } });
  });

  it('keeps siblings that already exist', () => {
    const target: Record<string, unknown> = { color: { text: 'black' } };
    deepSet(target, 'color.border', 'red');
    expect(target).toEqual({ color: { text: 'black', border: 'red' } });
  });

  it('overwrites the value at an existing path', () => {
    const target: Record<string, unknown> = { a: { b: 1 } };
    deepSet(target, 'a.b', 2);
    expect(target).toEqual({ a: { b: 2 } });
  });

  it('rejects an empty path', () => {
    expect(() => deepSet({}, '', 1)).toThrow('Path cannot be empty');
  });
});

describe('deepMerge', () => {
  it('merges nested objects instead of replacing them', () => {
    expect(deepMerge({ a: { x: 1, y: 2 } }, { a: { y: 3, z: 4 } })).toEqual({
      a: { x: 1, y: 3, z: 4 },
    });
  });

  it('concatenates arrays', () => {
    expect(deepMerge({ parts: [1, 2] }, { parts: [3] })).toEqual({ parts: [1, 2, 3] });
  });

  it('lets a later primitive win', () => {
    expect(deepMerge({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 });
  });

  it('does not mutate its inputs', () => {
    const first = { a: { x: 1 } };
    deepMerge(first, { a: { y: 2 } });
    expect(first).toEqual({ a: { x: 1 } });
  });

  it('skips non-object arguments', () => {
    expect(deepMerge({ a: 1 }, null as unknown as object, { b: 2 })).toEqual({ a: 1, b: 2 });
  });
});

describe('subKey', () => {
  it('joins parts with dots', () => {
    expect(subKey('color', 'surface', '500')).toBe('color.surface.500');
  });

  it('drops empty parts', () => {
    expect(subKey('color', '', '500')).toBe('color.500');
    expect(subKey('', '')).toBe('');
  });
});

describe('groupArrayUsing', () => {
  it('groups by the key function, preserving order', () => {
    const grouped = groupArrayUsing(
      [
        { scope: 'button', n: 1 },
        { scope: 'input', n: 2 },
        { scope: 'button', n: 3 },
      ],
      item => item.scope
    );
    expect([...grouped.keys()]).toEqual(['button', 'input']);
    expect(grouped.get('button')?.map(i => i.n)).toEqual([1, 3]);
  });

  it('returns an empty map for an empty array', () => {
    expect(groupArrayUsing([], () => 'x').size).toBe(0);
  });
});
