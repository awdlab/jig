import { executeMultiFilter } from '@awdlab/jig/api';

import type { FormattedTableRow } from './types';
import type { JigFilterConfig } from '@awdlab/jig/filter';
import type { PaginationState } from '@awdlab/jig/paginator';
import type { AllKeysOfUnion } from '@awdlab/jig/utils';

export type TableSort<T> = {
  column: Extract<AllKeysOfUnion<T>, string>;
  direction: 'asc' | 'desc';
};

export type TableFilters<T> =
  | { [key in Extract<AllKeysOfUnion<T>, string>]?: JigFilterConfig }
  | null;

export type TableSortComparator<T> = (a: T, b: T, sort: TableSort<T>) => number;

/** Applies the active multi-column filter set. Returns the input untouched when no filters are set. */
export function filterRows<T extends object>(
  rows: readonly T[],
  filters: TableFilters<T>
): readonly T[] {
  if (!filters) {
    return rows;
  }
  return executeMultiFilter(rows, filters);
}

/**
 * Default comparator: nulls sort first on `asc` / last on `desc`; numbers compare
 * numerically; everything else compares via `localeCompare` on the stringified value.
 */
export function defaultSortComparator<T>(a: T, b: T, sort: TableSort<T>): number {
  const { column, direction } = sort;
  // Mirrors the existing index access in groupRows / the original inline comparator.
  const aValue = (a as Record<string, unknown>)[column];
  const bValue = (b as Record<string, unknown>)[column];
  if (aValue == null && bValue != null) {
    return direction === 'asc' ? -1 : 1;
  }
  if (aValue != null && bValue == null) {
    return direction === 'asc' ? 1 : -1;
  }
  if (aValue == null && bValue == null) {
    return 0;
  }
  return typeof aValue === 'number' && typeof bValue === 'number'
    ? direction === 'asc'
      ? aValue - bValue
      : bValue - aValue
    : direction === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
}

/** Sorts rows without mutating the input. Returns the input untouched when no sort is set. */
export function sortRows<T>(
  rows: readonly T[],
  sort: TableSort<T> | null,
  comparator: TableSortComparator<T> = defaultSortComparator
): readonly T[] {
  if (!sort) {
    return rows;
  }
  return rows.toSorted((a, b) => comparator(a, b, sort));
}

/**
 * Builds a flat row list with group headers interleaved, preserving the incoming
 * (already filtered + sorted) order. Data rows appear only under expanded groups.
 */
export function groupRows<T>(
  rows: readonly T[],
  groupBy: string,
  fieldId: keyof T,
  expanded: ReadonlySet<unknown>
): FormattedTableRow<T>[] {
  const groupMap = new Map<unknown, T[]>();
  for (const row of rows) {
    const key = (row as Record<string, unknown>)[groupBy];
    let group = groupMap.get(key);
    if (!group) {
      group = [];
      groupMap.set(key, group);
    }
    group.push(row);
  }

  const result: FormattedTableRow<T>[] = [];
  let index = 0;
  for (const [groupKey, members] of groupMap) {
    const isExpanded = expanded.has(groupKey);
    result.push({
      kind: 'group-header',
      id: `group-${String(groupKey)}`,
      groupKey,
      groupValue: groupKey,
      count: members.length,
      expanded: isExpanded,
      index: index++,
    });
    if (isExpanded) {
      for (const data of members) {
        result.push({
          kind: 'data',
          id: data[fieldId] as T[keyof T] & (string | number),
          data,
          index: index++,
        });
      }
    }
  }
  return result;
}

/** Slices a formatted row list to the current page. Returns `[]` when there is no page state. */
export function paginateRows<T, V>(
  rows: readonly FormattedTableRow<T, V>[],
  pageState: PaginationState | null
): readonly FormattedTableRow<T, V>[] {
  if (!pageState) {
    return [];
  }
  return rows.slice(pageState.slice.skip, pageState.slice.take + pageState.slice.skip);
}
