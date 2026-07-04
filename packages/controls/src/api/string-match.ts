import { fuzzyMatch } from '@ngneers/controls/utils';

export type PredefinedStringMatchFunction =
  'contains' | 'startsWith' | 'endsWith' | 'equals' | 'fuzzy';

export function stringMatches(
  value: string,
  query: string,
  filterFn: PredefinedStringMatchFunction
): boolean {
  switch (filterFn) {
    case 'contains':
      return value.includes(query);
    case 'startsWith':
      return value.startsWith(query);
    case 'endsWith':
      return value.endsWith(query);
    case 'equals':
      return value === query;
    case 'fuzzy':
      return fuzzyMatch(value, query);
  }
}
