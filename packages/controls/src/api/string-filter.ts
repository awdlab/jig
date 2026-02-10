import { NgnError, notNullish } from '@ngneers/controls/utils';

import { stringMatches, type PredefinedStringMatchFunction } from './string-match';

export type PredefinedFilterFunctions = PredefinedStringMatchFunction;

export type FilterConfigInternal<T extends object> = FilterConfig<T> & {
  filterFieldsCallback: (item: T) => string | string[] | (() => string) | (() => string[]);
  fieldItems?: keyof T;
};

export type FilterConfig<T extends object> = {
  splitWords?: boolean;
  caseSensitive?: boolean;
  filterFn?: FilterFn<T>;
};

export type FilterFn<T extends object> =
  | PredefinedFilterFunctions
  | ((value: string, item: T) => Promise<boolean> | boolean);

async function filterItem<T extends object>(
  item: T,
  filterText: string,
  options: FilterConfigInternal<T>
): Promise<T | null> {
  const text = options.caseSensitive ? filterText : filterText.toLowerCase();
  const filterFieldsCallbackResultRaw = options.filterFieldsCallback?.(item);
  const filterFieldsCallbackResult =
    typeof filterFieldsCallbackResultRaw === 'function'
      ? filterFieldsCallbackResultRaw()
      : filterFieldsCallbackResultRaw;
  const fields = Array.isArray(filterFieldsCallbackResult)
    ? filterFieldsCallbackResult
    : [filterFieldsCallbackResult];
  const words = options.splitWords ? text.split(/\s+/) : [text];

  const itemDoesMatch = (
    await Promise.all(
      fields.map(async field => {
        const value = String(field);
        const valueStr = options.caseSensitive ? value : value.toLowerCase();
        return await itemMatches<T>(words, options, valueStr, item);
      })
    )
  ).some(result => result);

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
  const matchingChildren = await filterOptions(childItems, filterText, options);
  if (matchingChildren.length > 0) {
    return {
      ...item,
      [options.fieldItems]: matchingChildren,
    };
  }
  return null;
}

/**
 * @todo fix only one word needing to match
 */
async function itemMatches<T extends object>(
  words: string[],
  filterOptions: FilterConfigInternal<T>,
  itemString: string,
  item: T
): Promise<boolean> {
  const results = await Promise.all(
    words.map(async word => {
      const fn = filterOptions.filterFn ?? 'contains';
      if (typeof fn === 'string') {
        return stringMatches(itemString, word, fn);
      }
      if (typeof fn !== 'function') {
        throw new NgnError(
          'filtering',
          `Invalid filter function: ${String(fn)}. Expected a function or one of the predefined filter functions.`
        );
      }
      return await fn(word, item);
    })
  );
  return results.some(result => result);
}

export async function filterOptions<T extends object>(
  options: readonly T[],
  filterText: string,
  filterOptions: FilterConfigInternal<T>
): Promise<readonly T[]> {
  if (!filterText) {
    return options;
  }

  return (
    await Promise.all(
      options.map(async option => await filterItem(option, filterText, filterOptions))
    )
  ).filter(notNullish);
}
