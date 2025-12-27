import { computed, Signal } from '@angular/core';
import { NgnError } from '@ngneers/controls/utils';

export type NgnItem<T = any, K extends keyof T = any> = {
  data?: T;
  label: string;
  value: T[K];
  translate?: boolean;
  testId?: string;
  items?: NgnItem<T, K>[];
};

export type NgnItemFields<T, K extends keyof T> = {
  label: keyof T;
  value: K;
  testId?: keyof T;
  children?: keyof T;
};

export type NgnItemValue<Item extends NgnItem> = Item extends { items: readonly (infer A)[] }
  ? A extends NgnItem
    ? NgnItemValue<A>
    : never
  : Item extends { value: infer T }
    ? T
    : never;

export type NgnItemsValue<Items extends readonly NgnItem[]> = Items[number] extends infer A
  ? A extends NgnItem
    ? NgnItemValue<A>
    : never
  : never;

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

export function transformToNgnItems<Items extends readonly object[], K extends keyof Items[number]>(
  items: Items,
  fields: NgnItemFields<Items[number], K>
): { [P in keyof Items]: NgnItem<Items[P], K> } & readonly NgnItem<Items[number], K>[] {
  return items.map((item: Items[number]) => transformToNgnItem(item, fields)) as {
    [P in keyof Items]: NgnItem<Items[P], K>;
  } & readonly NgnItem<Items[number], K>[];
}

export function transformToNgnItemsSignal<
  T extends object,
  K extends keyof T,
  Items extends readonly T[],
>(
  items: Signal<Items>,
  fields: {
    label: keyof T;
    value: K;
    testId?: keyof T;
    children?: keyof T;
  }
): Signal<{ [P in keyof Items]: NgnItem<Items[P], K> } & readonly NgnItem<T, K>[]> {
  return computed(() => transformToNgnItems(items(), fields));
}

export function mapToItems(items: readonly NgnItem[]): readonly NgnItem[] {
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
