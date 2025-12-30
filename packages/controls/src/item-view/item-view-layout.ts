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
  visibleItemCount: number;
  renderedItemOrders: OverflowOrder;
  remainingItemOrders: OverflowOrder;
  overflowIndicatorCount: number;
  overflowIndicatorIndices: readonly (number | null)[];
};

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
      const arr = [...Array.from({ length: count - freezeCount }, (_, i) => i)];
      arr.splice(1, 0, ...Array.from({ length: freezeCount }, (_, i) => count - freezeCount + i));
      return arr.map(index => ({ index, location: 'end' }));
    }
    case 'start': {
      const arr = [...Array.from({ length: count - freezeCount }, (_, i) => count - i - 1)];
      arr.splice(1, 0, ...Array.from({ length: freezeCount }, (_, i) => i));
      return arr.map(index => ({ index, location: 'start' }));
    }
    case 'center': {
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

  const checkOrder = getItemOverflowCheckOrder({
    count,
    strategy: params.strategy,
    freezeCount: params.freezeCount,
    strategyIndex: params.strategyIndex,
  });

  const getFittingItemCount = (lostSpace: number): number => {
    let fittingItemCount = 0;
    let totalWidth = Math.max(0, lostSpace);

    for (let i = 0; i < checkOrder.length; i++) {
      const index = checkOrder[i].index;
      const itemWidth = params.itemWidths[index] ?? 0;
      const itemGap = i > 0 ? gap : 0;
      const newWidth = totalWidth + itemWidth + itemGap;

      if (newWidth <= containerWidth) {
        totalWidth = newWidth;
        fittingItemCount++;
      } else {
        break;
      }
    }

    return fittingItemCount;
  };

  let overflowIndicatorCount = 0;
  let previousOverflowIndicatorCount = -1;
  let visibleItemCount = 0;
  let remainingItemOrders: OverflowOrder = checkOrder;

  while (overflowIndicatorCount !== previousOverflowIndicatorCount) {
    previousOverflowIndicatorCount = overflowIndicatorCount;

    const theoreticalVisibleItemCount = getFittingItemCount(
      overflowIndicatorCount * (overflowItemWidth + gap)
    );

    remainingItemOrders = checkOrder
      .slice(theoreticalVisibleItemCount)
      .toSorted((a, b) => a.index - b.index);

    overflowIndicatorCount = new Set(remainingItemOrders.map(i => i.location)).size;

    visibleItemCount = getFittingItemCount(overflowIndicatorCount * (overflowItemWidth + gap));
  }

  const renderedItemOrders = checkOrder.slice(0, visibleItemCount);

  const overflowIndicatorIndices = (() => {
    if (overflowIndicatorCount === 1) {
      const overflowIndicatorIndex = checkOrder[visibleItemCount]?.index ?? -1;
      if (overflowIndicatorIndex >= 0) {
        return [overflowIndicatorIndex];
      }
    } else if (overflowIndicatorCount === 2) {
      const firstEndIndex = remainingItemOrders.find(x => x.location === 'end')?.index;
      const lastEndIndex = remainingItemOrders.findLast(x => x.location === 'end')?.index;
      const firstStartIndex = remainingItemOrders.find(x => x.location === 'start')?.index;
      const lastStartIndex = remainingItemOrders.findLast(x => x.location === 'start')?.index;
      const startIndex = firstStartIndex ?? firstEndIndex ?? 0;
      const endIndex = lastEndIndex ? lastEndIndex + 1 : (lastStartIndex ?? 0);
      return [startIndex + Math.min(Math.max(0, Math.floor(params.freezeCount)), count), endIndex];
    }
    return [null];
  })();

  return {
    checkOrder,
    visibleItemCount,
    renderedItemOrders,
    remainingItemOrders,
    overflowIndicatorCount,
    overflowIndicatorIndices,
  };
}
