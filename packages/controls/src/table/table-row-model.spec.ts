import { describe, expect, it } from 'vitest';

import {
  defaultSortComparator,
  filterRows,
  groupRows,
  paginateRows,
  sortRows,
  type TableSort,
} from './table-row-model';

type Row = { id: number; name: string; age: number | null; team: string };

const rows: readonly Row[] = [
  { id: 1, name: 'Bea', age: 30, team: 'a' },
  { id: 2, name: 'Ada', age: null, team: 'b' },
  { id: 3, name: 'Cyd', age: 20, team: 'a' },
];

describe('table-row-model', () => {
  describe('filterRows', () => {
    it('returns rows unchanged when filters is null', () => {
      expect(filterRows(rows, null)).toBe(rows);
    });
  });

  describe('sortRows', () => {
    it('returns rows unchanged when sort is null', () => {
      expect(sortRows(rows, null)).toBe(rows);
    });

    it('sorts numbers ascending and descending', () => {
      const asc = sortRows(rows, { column: 'id', direction: 'desc' });
      expect(asc.map(r => r.id)).toEqual([3, 2, 1]);
    });

    it('sorts strings via localeCompare', () => {
      const sorted = sortRows(rows, { column: 'name', direction: 'asc' });
      expect(sorted.map(r => r.name)).toEqual(['Ada', 'Bea', 'Cyd']);
    });

    it('orders nulls first on asc, last on desc', () => {
      const asc = sortRows(rows, { column: 'age', direction: 'asc' });
      expect(asc.map(r => r.age)).toEqual([null, 20, 30]);
      const desc = sortRows(rows, { column: 'age', direction: 'desc' });
      expect(desc.map(r => r.age)).toEqual([30, 20, null]);
    });

    it('does not mutate the input array', () => {
      const input = [...rows];
      sortRows(input, { column: 'id', direction: 'desc' });
      expect(input.map(r => r.id)).toEqual([1, 2, 3]);
    });

    it('uses a custom comparator when provided', () => {
      const byTeamThenId: (a: Row, b: Row, s: TableSort<Row>) => number = (a, b) =>
        a.team === b.team ? a.id - b.id : a.team.localeCompare(b.team);
      const sorted = sortRows(rows, { column: 'team', direction: 'asc' }, byTeamThenId);
      expect(sorted.map(r => r.id)).toEqual([1, 3, 2]);
    });
  });

  describe('defaultSortComparator', () => {
    it('returns 0 when both values are null', () => {
      const a = { id: 1, name: '', age: null, team: '' };
      const b = { id: 2, name: '', age: null, team: '' };
      expect(defaultSortComparator(a, b, { column: 'age', direction: 'asc' })).toBe(0);
    });
  });

  describe('groupRows', () => {
    it('emits a group header per distinct key, collapsed by default', () => {
      const result = groupRows(rows, 'team', 'id', new Set());
      expect(result.map(r => r.kind)).toEqual(['group-header', 'group-header']);
      expect(result.map(r => (r.kind === 'group-header' ? r.count : -1))).toEqual([2, 1]);
    });

    it('interleaves data rows under expanded groups only', () => {
      const result = groupRows(rows, 'team', 'id', new Set(['a']));
      expect(result.map(r => r.kind)).toEqual(['group-header', 'data', 'data', 'group-header']);
    });

    it('assigns sequential indexes across headers and data', () => {
      const result = groupRows(rows, 'team', 'id', new Set(['a']));
      expect(result.map(r => r.index)).toEqual([0, 1, 2, 3]);
    });
  });

  describe('paginateRows', () => {
    const formatted = rows.map((data, index) => ({
      kind: 'data' as const,
      id: data.id,
      data,
      index,
    }));

    it('returns an empty array when pageState is null', () => {
      expect(paginateRows(formatted, null)).toEqual([]);
    });

    it('slices using skip and take', () => {
      const page = paginateRows(formatted, { slice: { skip: 1, take: 1 } } as never);
      expect(page.map(r => (r.kind === 'data' ? r.id : -1))).toEqual([2]);
    });
  });
});
