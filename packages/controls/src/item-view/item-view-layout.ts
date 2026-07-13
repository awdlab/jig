import { NgnError } from '@ngneers/controls/utils';

import type { OverflowStrategy } from './types';

export type ItemOverflowLocation = 'start' | 'end' | 'center';

export type OverflowOrderEntry = {
  index: number;
  location: ItemOverflowLocation;
};

export type OverflowOrder = readonly OverflowOrderEntry[];

export type ItemViewLayoutInput = {
  count: number;
  strategy: OverflowStrategy;
  freezeCount: number;
  strategyIndex: number;
  containerWidth: number;
  itemWidths: readonly number[];
  overflowItemWidth: number;
  gap: number;
};

export type ItemViewLayoutResult = {
  checkOrder: OverflowOrder;
  renderedItemOrders: OverflowOrder;
  remainingItemOrders: OverflowOrder;
  overflowIndicatorCount: number;
  overflowIndicatorIndices: readonly (number | null)[];
};

/**
 * Returns the *priority order* in which items are considered for keeping visible.
 * The algorithm is greedy: it walks this list until items no longer fit.
 * Each entry also carries a `location` which describes which overflow indicator would own the item.
 */
export function getItemOverflowCheckOrder(params: {
  count: number;
  strategy: OverflowStrategy;
  freezeCount: number;
  strategyIndex: number;
}): OverflowOrder {
  const count = Math.max(0, Math.floor(params.count));
  if (count === 0) {
    return [];
  }

  const freezeCount = Math.min(Math.max(0, Math.floor(params.freezeCount)), count);

  switch (params.strategy) {
    case 'end': {
      const arr = Array.from({ length: count - freezeCount }, (_, i) => i);
      arr.splice(1, 0, ...Array.from({ length: freezeCount }, (_, i) => count - freezeCount + i));
      return arr.map(index => ({ index, location: 'end' }));
    }
    case 'start': {
      const arr = Array.from({ length: count - freezeCount }, (_, i) => count - i - 1);
      arr.splice(1, 0, ...Array.from({ length: freezeCount }, (_, i) => i));
      return arr.map(index => ({ index, location: 'start' }));
    }
    case 'center': {
      // "Center" overflows symmetrically: keep alternating left/right items first.
      const order: OverflowOrderEntry[] = [];
      let leftIndex = 0;
      let rightIndex = count - 1;

      for (let i = 0; i < count; i++) {
        if (i % 2 === 0) {
          order.push({ index: leftIndex++, location: 'center' } as const);
        } else {
          order.push({ index: rightIndex--, location: 'center' } as const);
        }
      }
      return order;
    }
    case 'aroundIndex': {
      // "AroundIndex" keeps the chosen item visible, then expands outward on both sides.
      // FreezeCount applies to both ends; we must ensure the chosen index stays in-bounds.
      const minIndex = Math.min(freezeCount, count - 1);
      const maxIndex = Math.max(minIndex, count - freezeCount - 1);
      const index = Math.min(Math.max(minIndex, Math.floor(params.strategyIndex)), maxIndex);

      const targetMiddleCount = Math.max(0, count - freezeCount * 2);
      const order: { index: number; location: 'start' | 'end' }[] =
        targetMiddleCount > 0 ? [{ index, location: 'start' }] : [];

      let offset = 1;
      while (order.length < targetMiddleCount) {
        if (index - offset >= freezeCount) {
          order.push({ index: index - offset, location: 'start' });
        }
        if (order.length >= targetMiddleCount) {
          break;
        }
        if (index + offset < count - freezeCount) {
          order.push({
            index: index + offset,
            location: 'end',
          });
        }
        offset++;
      }

      // Insert frozen items near the front of the list so they are kept visible.
      // Keep the insertion ordering consistent with the component implementation.
      order.splice(
        1,
        0,
        ...Array.from({ length: freezeCount }, (_, i) => ({ index: i, location: 'start' }) as const)
      );
      order.splice(
        1,
        0,
        ...Array.from(
          { length: freezeCount },
          (_, i) =>
            ({
              index: count - freezeCount + i,
              location: 'end',
            }) as const
        )
      );

      return order;
    }
  }
}

export function calculateItemViewLayout(params: ItemViewLayoutInput): ItemViewLayoutResult {
  const count = Math.max(0, Math.floor(params.count));
  const containerWidth = Math.max(0, params.containerWidth);
  const overflowItemWidth = Math.max(0, params.overflowItemWidth);
  const gap = Math.max(0, params.gap);
  const maxOverflowIndicatorCount = params.strategy === 'aroundIndex' ? 2 : 1;

  const overflowCheckOrder = getItemOverflowCheckOrder({
    count,
    strategy: params.strategy,
    freezeCount: params.freezeCount,
    strategyIndex: params.strategyIndex,
  });

  const getVisibleItemCount = (reservedWidth: number): number => {
    let visibleItemCount = 0;
    let totalWidth = Math.max(0, reservedWidth);

    for (let i = 0; i < overflowCheckOrder.length; i++) {
      const index = overflowCheckOrder[i]?.index;
      if (index === undefined) {
        throw new NgnError(
          'calculateItemViewLayout',
          'Invalid overflow check order: index is undefined'
        );
      }
      const itemWidth = params.itemWidths[index] ?? 0;
      const itemGap = i > 0 ? gap : 0;
      const newWidth = totalWidth + itemWidth + itemGap;

      if (newWidth <= containerWidth) {
        totalWidth = newWidth;
        visibleItemCount++;
      } else {
        break;
      }
    }

    return visibleItemCount;
  };

  let overflowIndicatorCount = 0;
  let previousOverflowIndicatorCount = -1;
  let remainingItemOrders: OverflowOrder = overflowCheckOrder;
  let renderedItemOrders: OverflowOrderEntry[] = [];
  let overflowIndicatorLocations = new Set<ItemOverflowLocation>();

  // Fixed-point iteration:
  // 1) We blindly assume that we don't need any overflow indicators for the first pass.
  // 2) We see how many items fit with that assumption.
  // 3) The remaining items define which overflow locations exist (start/end/center).
  // 4) That determines the *actual* number of indicators.
  // Repeat until the indicator count stabilizes.
  while (overflowIndicatorCount !== previousOverflowIndicatorCount) {
    previousOverflowIndicatorCount = overflowIndicatorCount;

    const initialVisibleItemCount = getVisibleItemCount(
      overflowIndicatorCount * (overflowItemWidth + gap)
    );

    remainingItemOrders = overflowCheckOrder
      .slice(initialVisibleItemCount)
      .toSorted((a, b) => a.index - b.index);

    overflowIndicatorLocations = new Set(remainingItemOrders.map(i => i.location));
    overflowIndicatorCount = overflowIndicatorLocations.size;
    const finalVisibleItemCount = getVisibleItemCount(
      overflowIndicatorCount * (overflowItemWidth + gap)
    );
    renderedItemOrders = overflowCheckOrder.slice(0, finalVisibleItemCount);
  }

  (['start', 'end'] as const).forEach(location => {
    // Optimization: if all overflowed items for a side would fit inside the overflow indicator width,
    // we can render them inline and drop that overflow indicator entirely.
    // This is only applicable for start/end & the aroundIndex strategy. Center has no "adjacent" insertion point.
    if (overflowIndicatorLocations.has(location)) {
      const itemsWithIndices = remainingItemOrders
        .map((x, i) => [i + renderedItemOrders.length, x] as const)
        .filter(x => x[1].location === location);
      const itemSizes = itemsWithIndices.map(i => params.itemWidths[i[1].index] ?? 0);
      const itemsTotalSize = itemSizes.reduce((a, b) => a + b, 0);
      if (itemsTotalSize <= overflowItemWidth) {
        overflowIndicatorLocations.delete(location);
        renderedItemOrders = [...renderedItemOrders, ...itemsWithIndices.map(i => i[1])];
        overflowIndicatorCount--;
      }
    }
  });

  // Keep result consistent after the optimization pass.
  const renderedIndices = new Set(renderedItemOrders.map(x => x.index));
  remainingItemOrders = overflowCheckOrder
    .filter(x => !renderedIndices.has(x.index))
    .toSorted((a, b) => a.index - b.index);

  // Calculate the insertion indices for the overflow indicators.
  const overflowIndicatorIndices = (() => {
    if (overflowIndicatorCount === 0) {
      return [null];
    } else if (maxOverflowIndicatorCount === 1 && overflowIndicatorCount === 1) {
      return [remainingItemOrders[0]?.index ?? null];
    } else if (maxOverflowIndicatorCount === 2) {
      const res: number[] = [];
      const firstEndIndex = remainingItemOrders.find(x => x.location === 'end')?.index;
      const lastEndIndex = remainingItemOrders.findLast(x => x.location === 'end')?.index;
      const firstStartIndex = remainingItemOrders.find(x => x.location === 'start')?.index;
      const lastStartIndex = remainingItemOrders.findLast(x => x.location === 'start')?.index;
      if (overflowIndicatorLocations.has('start')) {
        const startIndex = firstStartIndex ?? firstEndIndex ?? 0;
        res.push(startIndex + Math.min(Math.max(0, Math.floor(params.freezeCount)), count));
      }
      if (overflowIndicatorLocations.has('end')) {
        const endIndex = lastEndIndex ? lastEndIndex + 1 : (lastStartIndex ?? 0);
        res.push(endIndex);
      }
      return res;
    }
    return [];
  })();

  return {
    checkOrder: overflowCheckOrder,
    renderedItemOrders,
    remainingItemOrders,
    overflowIndicatorCount,
    overflowIndicatorIndices,
  };
}
