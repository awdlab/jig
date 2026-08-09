import { computed, type Signal } from '@angular/core';
import { transformToJigItems, type JigItem, type JigItemFields } from '@awdlab/jig/api';

export function transformToJigItemsSignal<
  T extends object,
  K extends keyof T,
  Items extends readonly T[],
>(
  items: Signal<Items>,
  fields: JigItemFields<T, K>
): Signal<{ [P in keyof Items]: JigItem<Items[P], K> } & readonly JigItem<T, K>[]> {
  return computed(() => transformToJigItems(items(), fields));
}
