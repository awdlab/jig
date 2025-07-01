import { notNullish } from '@ngneers/controls/utils';

export type PredefinedFilterFunctions = 'contains' | 'startsWith' | 'endsWith' | 'equals';

export type FilterConfig<T extends object> = {
  filterFieldsCallback: (item: T) => string | string[];
  fieldItems?: keyof T;
  splitWords?: boolean;
  caseSensitive?: boolean;
  filterFn?: PredefinedFilterFunctions | ((value: string, item: T) => boolean);
};

function filterItem<T extends object>(
  item: T,
  filterText: string,
  options: FilterConfig<T>
): T | null {
  const text = options.caseSensitive ? filterText : filterText.toLowerCase();
  const filterFieldsCallbackResult = options.filterFieldsCallback?.(item);
  const fields = Array.isArray(filterFieldsCallbackResult)
    ? filterFieldsCallbackResult
    : [filterFieldsCallbackResult];
  const words = options.splitWords ? text.split(/\s+/) : [text];

  const itemDoesMatch = fields.some(field => {
    const value = String(field);
    const valueStr = options.caseSensitive ? value : value.toLowerCase();
    return itemMatches<T>(words, options, valueStr);
  });
  if (itemDoesMatch) {
    return item;
  }
  if (!options.fieldItems) {
    return null;
  }
  const childItems = item[options.fieldItems] as T[];
  if (!childItems || !Array.isArray(childItems) || childItems.length === 0) {
    return null;
  }
  const matchingChildren = filterOptions(childItems, filterText, options);
  if (matchingChildren.length > 0) {
    return {
      ...item,
      [options.fieldItems]: matchingChildren,
    };
  }
  return null;
}

function itemMatches<T extends object>(
  words: string[],
  filterOptions: FilterConfig<T>,
  item: string
): unknown {
  return words.every(word => {
    switch (filterOptions.filterFn) {
      case 'contains':
      default:
        return item.includes(word);
      case 'startsWith':
        return item.startsWith(word);
      case 'endsWith':
        return item.endsWith(word);
      case 'equals':
        return item === word;
    }
  });
}

export function filterOptions<T extends object>(
  options: T[],
  filterText: string,
  filterOptions: FilterConfig<T>
): readonly T[] {
  if (!filterText) {
    return options;
  }
  return options.map(option => filterItem(option, filterText, filterOptions)).filter(notNullish);
}
