import { describe, expect, it } from 'vitest';

import { combineVariations } from './combine-variations.js';
import { repeatVariables } from './repeat-variables.js';

describe('combineVariations', () => {
  it('produces every pair, first list outermost', () => {
    expect(combineVariations(['sm', 'lg'], ['solid', 'ghost'])).toEqual([
      ['sm', 'solid'],
      ['sm', 'ghost'],
      ['lg', 'solid'],
      ['lg', 'ghost'],
    ]);
  });

  it('is empty when either list is', () => {
    expect(combineVariations([], ['a'])).toEqual([]);
    expect(combineVariations(['a'], [])).toEqual([]);
  });
});

describe('repeatVariables', () => {
  it('repeats the variable set under each variation', () => {
    expect(repeatVariables(['primary', 'surface'], { 50: null, 100: null })).toEqual({
      primary: { 50: null, 100: null },
      surface: { 50: null, 100: null },
    });
  });

  it('nests a dotted variation', () => {
    expect(repeatVariables(['a.b'], { x: null })).toEqual({ a: { b: { x: null } } });
  });
});
