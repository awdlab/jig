import { SelectOption, SelectOptionFields } from './types';

export function transformToSelectOption<T extends object, K extends keyof T>(
  option: T,
  fields: SelectOptionFields<T, K>
): SelectOption<T, K> {
  const rawItems = fields.groupItems ? option[fields.groupItems] : undefined;
  if (rawItems && !Array.isArray(rawItems)) {
    throw new Error(
      `Expected groupItems to be an array, but got ${typeof rawItems} for option: ${JSON.stringify(option)}`
    );
  }
  const items = (rawItems as T[])?.length
    ? transformToSelectOptions(rawItems as T[], fields)
    : undefined;
  return {
    data: option,
    label: option[fields.label] as string,
    value: option[fields.value],
    testId: fields.testId ? (option[fields.testId] as string) : undefined,
    items: items,
  };
}

export function transformToSelectOptions<Option extends object, K extends keyof Option>(
  options: readonly Option[],
  fields: {
    label: keyof Option;
    value: K;
    testId?: keyof Option;
    groupItems?: keyof Option;
  }
): SelectOption<Option, K>[] {
  return options.map(option => transformToSelectOption(option, fields));
}
