import { NgnError } from '@ngneers/controls/utils';

export type NgnItem<T = any, K extends keyof T = any> = {
  data?: T;
  label: string;
  value: T[K];
  testId?: string;
  items?: NgnItem<T, K>[];
};

export type NgnItemFields<T, K extends keyof T> = {
  label: keyof T;
  value: K;
  testId?: keyof T;
  children?: keyof T;
};

export function transformToNgnItem<T extends object, K extends keyof T>(
  item: T,
  fields: NgnItemFields<T, K>
): NgnItem<T, K> {
  const rawItems = fields.children ? item[fields.children] : undefined;
  if (rawItems && !Array.isArray(rawItems)) {
    throw new NgnError(
      'transformToNgnItem',
      `Expected children to be an array, but got ${typeof rawItems} for item: ${JSON.stringify(item)}`
    );
  }
  const items = (rawItems as T[])?.length
    ? transformToNgnItems(rawItems as T[], fields)
    : undefined;
  return {
    data: item,
    label: item[fields.label] as string,
    value: item[fields.value],
    testId: fields.testId ? (item[fields.testId] as string) : undefined,
    items: items,
  };
}

export function transformToNgnItems<T extends object, K extends keyof T>(
  items: readonly T[],
  fields: {
    label: keyof T;
    value: K;
    testId?: keyof T;
    children?: keyof T;
  }
): NgnItem<T, K>[] {
  return items.map(item => transformToNgnItem(item, fields));
}

export function mapToItems(items: readonly NgnItem[]): NgnItem[] {
  return items
    .map(item => {
      if (item.items) {
        return item.items;
      }
      return [item];
    })
    .flat();
}

export function flatItems(items: readonly NgnItem[]): NgnItem[] {
  return items
    .map(item => {
      if (item.items) {
        return [item, ...item.items];
      }
      return [item];
    })
    .flat();
}
