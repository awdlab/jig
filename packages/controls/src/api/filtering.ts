export type PredefinedFilterFunctions = 'contains' | 'startsWith' | 'endsWith' | 'equals';

export type FilterConfig<T extends object> = {
  filterFields: keyof T | (keyof T)[];
  splitWords?: boolean;
  caseSensitive?: boolean;
  filterFn?: PredefinedFilterFunctions | ((value: string, item: T) => boolean);
};

function filterItem<T extends object>(
  option: T,
  filterText: string,
  filterOptions: FilterConfig<T>
): boolean {
  const text = filterOptions.caseSensitive ? filterText : filterText.toLowerCase();
  const fields = Array.isArray(filterOptions.filterFields)
    ? filterOptions.filterFields
    : [filterOptions.filterFields];
  const words = filterOptions.splitWords ? text.split(/\s+/) : [text];

  return fields.some(field => {
    const value = String(option[field]);
    const item = filterOptions.caseSensitive ? value : value.toLowerCase();

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
  });
}

export function filterOptions<T extends object>(
  options: readonly T[],
  filterText: string,
  filterOptions: FilterConfig<T>
): readonly T[] {
  if (!filterText) {
    return options;
  }
  return options.filter(option => filterItem(option, filterText, filterOptions));
}
