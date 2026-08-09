import { describe, expect, it } from 'vitest';

import { calculateItemViewLayout, getItemOverflowCheckOrder } from './item-view-layout';

import type { OverflowStrategy } from './types';

function getVisibleIndices(layout: { renderedItemOrders: readonly { index: number }[] }): number[] {
  return layout.renderedItemOrders
    .map(x => x.index)
    .slice()
    .sort((a, b) => a - b);
}

function getFittingItemCount(params: {
  containerWidth: number;
  checkOrder: readonly { index: number }[];
  itemWidths: readonly number[];
  gap: number;
  lostSpace: number;
}): number {
  let fittingItemCount = 0;
  let totalWidth = Math.max(0, params.lostSpace);

  for (let i = 0; i < params.checkOrder.length; i++) {
    const index = params.checkOrder[i].index;
    const itemWidth = params.itemWidths[index] ?? 0;
    const itemGap = i > 0 ? params.gap : 0;
    const newWidth = totalWidth + itemWidth + itemGap;
    if (newWidth <= params.containerWidth) {
      totalWidth = newWidth;
      fittingItemCount++;
    } else {
      break;
    }
  }

  return fittingItemCount;
}

describe('item-view layout', () => {
  const itemWidth = 50;
  const overflowWidth = 50;
  const gap = 0;
  const count = 10;
  const widths = Array.from({ length: count }, () => itemWidth);

  const containerWidths = [0, itemWidth + 1, 3 * itemWidth - 1, 3 * itemWidth + 1];

  it('aroundIndex check order should not contain duplicates (regression)', () => {
    const order = getItemOverflowCheckOrder({
      count: 60,
      strategy: 'aroundIndex',
      freezeCount: 0,
      strategyIndex: 8,
    });

    const indices = order.map(x => x.index);
    expect(new Set(indices).size).toBe(indices.length);
    expect(order.length).toBe(60);
  });

  (
    ['end', 'start', 'center', 'aroundIndex'] as const satisfies readonly OverflowStrategy[]
  ).forEach(strategy => {
    describe(`${strategy} strategy`, () => {
      [0, 1, 2].forEach(freezeCount => {
        describe(`freezeCount=${freezeCount}`, () => {
          const resultsByWidth: Array<{ containerWidth: number; visibleItemCount: number }> = [];

          if (strategy !== 'aroundIndex') {
            it('matches expected visible counts for uniform item widths', () => {
              const expectedByWidth: Record<number, number> = {
                0: 0,
                [itemWidth + 1]: 0,
                [3 * itemWidth - 1]: 1,
                [3 * itemWidth + 1]: 2,
              };

              containerWidths.forEach(containerWidth => {
                const layout = calculateItemViewLayout({
                  count,
                  strategy,
                  freezeCount,
                  strategyIndex: 8,
                  containerWidth,
                  itemWidths: widths,
                  overflowItemWidth: overflowWidth,
                  gap,
                });

                expect(layout.renderedItemOrders.length).toBe(expectedByWidth[containerWidth]);
              });
            });
          }

          containerWidths.forEach(containerWidth => {
            it(`containerWidth=${containerWidth} -> layout converges and is stable`, () => {
              const layout = calculateItemViewLayout({
                count,
                strategy,
                freezeCount,
                strategyIndex: 8,
                containerWidth,
                itemWidths: widths,
                overflowItemWidth: overflowWidth,
                gap,
              });

              resultsByWidth.push({
                containerWidth,
                visibleItemCount: layout.renderedItemOrders.length,
              });

              // Basic sanity: no duplicates in the chosen visible indices.
              const visible = getVisibleIndices(layout);
              expect(new Set(visible).size).toBe(visible.length);

              // Fixed-point: the final overflowIndicatorCount matches the remaining locations.
              const remainingOrders = layout.remainingItemOrders
                .slice()
                .sort((a, b) => a.index - b.index);
              expect(new Set(remainingOrders.map(x => x.location)).size).toBe(
                layout.overflowIndicatorCount
              );

              // Overflow indicator insertion indices are a common regression point.
              // Assert indices are consistent with the derived remaining orders.
              if (layout.overflowIndicatorCount === 0) {
                expect(layout.overflowIndicatorIndices).toEqual([null]);
              } else if (layout.overflowIndicatorCount === 1) {
                // aroundIndex inserts at a derived index (start side accounts for freezeCount).
                if (strategy === 'aroundIndex') {
                  const firstEndIndex = remainingOrders.find(x => x.location === 'end')?.index;
                  const lastEndIndex = remainingOrders.findLast(x => x.location === 'end')?.index;
                  const firstStartIndex = remainingOrders.find(x => x.location === 'start')?.index;
                  const lastStartIndex = remainingOrders.findLast(
                    x => x.location === 'start'
                  )?.index;

                  let expectedIndex: number | null = null;
                  if (remainingOrders.some(x => x.location === 'start')) {
                    const startIndex = firstStartIndex ?? firstEndIndex ?? 0;
                    expectedIndex = startIndex + freezeCount;
                  } else if (remainingOrders.some(x => x.location === 'end')) {
                    expectedIndex = lastEndIndex ? lastEndIndex + 1 : (lastStartIndex ?? 0);
                  }

                  expect(layout.overflowIndicatorIndices).toEqual([expectedIndex]);
                } else {
                  const expectedIndex = remainingOrders[0]?.index ?? null;
                  expect(layout.overflowIndicatorIndices).toEqual([expectedIndex]);
                  if (expectedIndex !== null) {
                    expect(Number.isInteger(expectedIndex)).toBe(true);
                    expect(expectedIndex).toBeGreaterThanOrEqual(0);
                    expect(expectedIndex).toBeLessThan(count);
                  }
                }
              } else if (layout.overflowIndicatorCount === 2) {
                const firstEndIndex = remainingOrders.find(x => x.location === 'end')?.index;
                const lastEndIndex = remainingOrders.findLast(x => x.location === 'end')?.index;
                const firstStartIndex = remainingOrders.find(x => x.location === 'start')?.index;
                const lastStartIndex = remainingOrders.findLast(x => x.location === 'start')?.index;
                const startIndex = firstStartIndex ?? firstEndIndex ?? 0;
                const endIndex = lastEndIndex ? lastEndIndex + 1 : (lastStartIndex ?? 0);
                const expected = [startIndex + freezeCount, endIndex];
                expect(layout.overflowIndicatorIndices).toEqual(expected);

                expected.forEach(idx => {
                  expect(Number.isInteger(idx)).toBe(true);
                  expect(idx).toBeGreaterThanOrEqual(0);
                  expect(idx).toBeLessThanOrEqual(count);
                });
                expect(expected[0]).toBeLessThanOrEqual(expected[1]);
              }

              // Partition sanity: rendered + remaining covers all items exactly once.
              const renderedIndices = new Set(layout.renderedItemOrders.map(x => x.index));
              const remainingIndices = new Set(layout.remainingItemOrders.map(x => x.index));
              expect(renderedIndices.size).toBe(layout.renderedItemOrders.length);
              expect(remainingIndices.size).toBe(layout.remainingItemOrders.length);
              expect(renderedIndices.size + remainingIndices.size).toBe(count);
              remainingIndices.forEach(idx => expect(renderedIndices.has(idx)).toBe(false));
            });
          });

          it('visibleItemCount is monotonic with container width', () => {
            const sorted = resultsByWidth
              .slice()
              .sort((a, b) => a.containerWidth - b.containerWidth);
            for (let i = 1; i < sorted.length; i++) {
              expect(sorted[i].visibleItemCount).toBeGreaterThanOrEqual(
                sorted[i - 1].visibleItemCount
              );
            }
          });

          it('freezeCount influences checkOrder priority (when applicable)', () => {
            if (freezeCount === 0) {
              return;
            }

            const order = getItemOverflowCheckOrder({
              count,
              strategy,
              freezeCount,
              strategyIndex: 8,
            });

            if (strategy === 'center') {
              // Center strategy ignores freezeCount by design.
              return;
            }

            if (strategy === 'end') {
              const expectedFrozen = Array.from(
                { length: freezeCount },
                (_, i) => count - freezeCount + i
              );
              const prioritized = order.slice(1, 1 + freezeCount).map(x => x.index);
              expect(prioritized).toEqual(expectedFrozen);
            }

            if (strategy === 'start') {
              const expectedFrozen = Array.from({ length: freezeCount }, (_, i) => i);
              const prioritized = order.slice(1, 1 + freezeCount).map(x => x.index);
              expect(prioritized).toEqual(expectedFrozen);
            }

            if (strategy === 'aroundIndex') {
              const expectedFrozenEnd = Array.from(
                { length: freezeCount },
                (_, i) => count - freezeCount + i
              );
              const expectedFrozenStart = Array.from({ length: freezeCount }, (_, i) => i);

              const prioritizedEnd = order.slice(1, 1 + freezeCount).map(x => x.index);
              const prioritizedStart = order
                .slice(1 + freezeCount, 1 + freezeCount * 2)
                .map(x => x.index);

              expect(prioritizedEnd).toEqual(expectedFrozenEnd);
              expect(prioritizedStart).toEqual(expectedFrozenStart);
            }
          });
        });
      });
    });
  });

  it.fails('KNOWN ISSUE: greedy selection may overflow an item that could fit later', () => {
    // This demonstrates a non-optimal selection: a tiny item exists later in the checkOrder,
    // but the greedy algorithm stops on a large item and never tries to include the tiny one.
    const greedyTrapWidths = [1, 50, 50, 50, 50];
    const trapCount = greedyTrapWidths.length;

    const layout = calculateItemViewLayout({
      count: trapCount,
      strategy: 'aroundIndex',
      freezeCount: 0,
      strategyIndex: 3,
      containerWidth: 2 * 10 + 50 + 50 + 1, // 2 overflow indicators + 2 large + 1 tiny
      itemWidths: greedyTrapWidths,
      overflowItemWidth: 10,
      gap: 0,
    });

    // Optimal could show 3 items (50 + 50 + 1) but current algorithm shows only 2.
    expect(layout.renderedItemOrders.length).toBe(3);
  });
});
