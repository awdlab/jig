import { computed, type Signal } from '@angular/core';
import { transformToNgnItems, type NgnItem, type NgnItemFields } from '@awdlab/jig/api';

export function transformToNgnItemsSignal<
  T extends object,
  K extends keyof T,
  Items extends readonly T[],
>(
  items: Signal<Items>,
  fields: NgnItemFields<T, K>
): Signal<{ [P in keyof Items]: NgnItem<Items[P], K> } & readonly NgnItem<T, K>[]> {
  return computed(() => transformToNgnItems(items(), fields));
}
