import { JigError } from '@awdlab/jig/utils';

import type { IconType } from '@awdlab/jig-custom-types';

export type JigItem<T = any, V = any> = {
  data?: T;
  label: string | (() => string);
  icon?: IconType;
  value: V;
  testId?: string;
  disabled?: boolean;
  items?: JigItem<T, V>[];
};

export type JigItemFields<T, K extends keyof T> = {
  label: keyof T;
  value: K;
  translate?: keyof T;
  testId?: keyof T;
  children?: keyof T;
};

export type JigItemValue<Item extends JigItem> = Item extends { items: readonly (infer A)[] }
  ? A extends JigItem
    ? JigItemValue<A>
    : never
  : Item extends { value: infer T }
    ? T
    : never;

export type JigItemsValue<Items extends readonly JigItem[]> = Items[number] extends infer A
  ? A extends JigItem
    ? JigItemValue<A>
    : never
  : never;

export function transformToJigItem<T extends object, K extends keyof T>(
  item: T,
  fields: JigItemFields<T, K>
): JigItem<T, T[K]> {
  const rawItems = fields.children ? item[fields.children] : undefined;
  if (rawItems && !Array.isArray(rawItems)) {
    throw new JigError(
      'transformToJigItem',
      `Expected children to be an array, but got ${typeof rawItems} for item: ${JSON.stringify(item)}`
    );
  }
  const items = (rawItems as T[])?.length
    ? transformToJigItems(rawItems as T[], fields)
    : undefined;
  return {
    data: item,
    label: item[fields.label] as string | (() => string),
    value: item[fields.value],
    testId: fields.testId ? (item[fields.testId] as string) : undefined,
    items: items as JigItem<T, T[K]>[],
  };
}

export function transformToJigItemPrimitive<T extends string | number>(
  item: T
): JigItem<unknown, T> {
  return transformToJigItem({ var: item }, { label: 'var', value: 'var' });
}

export function transformToJigItems<Items extends readonly object[], K extends keyof Items[number]>(
  items: Items,
  fields: JigItemFields<Items[number], K>
): { [P in keyof Items]: JigItem<Items[P], K> } & readonly JigItem<Items[number], K>[] {
  return items.map((item: Items[number]) => transformToJigItem(item, fields)) as {
    [P in keyof Items]: JigItem<Items[P], K>;
  } & readonly JigItem<Items[number], K>[];
}

export function mapToItems(items: readonly JigItem[]): readonly JigItem[] {
  return items
    .map(item => {
      if (item.items) {
        return item.items;
      }
      return [item];
    })
    .flat();
}

export function flatItems(items: readonly JigItem[]): JigItem[] {
  return items
    .map(item => {
      if (item.items) {
        return [item, ...item.items];
      }
      return [item];
    })
    .flat();
}
