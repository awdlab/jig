import { afterRenderEffect, computed, signal, type Signal, untracked } from '@angular/core';

import {
  expandResizeLimit,
  expandResizeSize,
  getResizeLimitInPx,
  getResizeLimitUnit,
  getResizeLimitValue,
  pxDeltaToUnitDelta,
  resolveSizeToPx,
} from './utils';

import type {
  ExpandedResizeLimit,
  ResizableItem,
  ResizeDragContext,
  ResizeDragContextItem,
  ResizeEngineConfig,
  ResizeFractionFactors,
  ResizeSize,
} from './types';

const LAST_CALC_SIZE_SYMBOL = Symbol('lastCalcSize');

/** A {@link ResizableItem} carrying the engine's last-written size under a private symbol. */
type ItemWithLastCalcSize = ResizableItem & { [LAST_CALC_SIZE_SYMBOL]?: ResizeSize };

/**
 * A generic, control-agnostic resize engine for CSS grid layouts.
 *
 * Handles drag-based resizing of a list of {@link ResizableItem}s with support for:
 * - **Size units**: `px`, `fr`, `%`
 * - **Distribution modes**:
 *   - `adjacent` — transfers space between the two items neighbouring the divider (zero-sum).
 *   - `proportional` — only the dragged item changes to `px`; other items keep their `fr`/`%`
 *     units and CSS grid redistributes the remaining space. Optionally locks the resized item
 *     to `px` via {@link ResizeEngineConfig.lockSizes}.
 *   - `push` — the dragged item grows/shrinks independently; the container total changes
 *     (requires `containerConstrained = false`).
 * - **Commit modes** (for `adjacent`/`push`): `preserve`, `bakeAll`, `bakeAffected`
 * - **Min-size floor** ({@link ResizeEngineConfig.minItemSizePx}): an absolute `px` floor
 *   enforced even when a relative min-size resolves smaller. In `proportional` mode, emitted
 *   as CSS `minmax(floor, size)` so the grid natively prevents columns from shrinking below it.
 *
 * Consumers (splitter, table) provide items and configuration via signals.
 * The engine outputs a ready-to-use `grid-template-columns`/`grid-template-rows` string
 * via {@link gridTemplateSizes}.
 */
export class ResizeEngine {
  private readonly items: Signal<readonly ResizableItem[]>;
  private readonly containerSize: Signal<number>;
  private readonly gapSizes: Signal<readonly number[]>;
  private readonly distributionMode: ResizeEngineConfig['distributionMode'];
  private readonly containerConstrained: ResizeEngineConfig['containerConstrained'];
  private readonly lockSizes: Signal<boolean>;
  private readonly minItemSizePx: number;
  private readonly resolveItemSizes?: () => number[];

  constructor(config: ResizeEngineConfig) {
    this.items = config.items;
    this.containerSize = config.containerSize;
    this.gapSizes = config.gapSizes;
    this.distributionMode = config.distributionMode;
    this.containerConstrained = config.containerConstrained;
    this.lockSizes = config.lockSizes ?? signal(false);
    this.minItemSizePx = config.minItemSizePx ?? 0;
    this.resolveItemSizes = config.resolveItemSizes;

    // Signal fires when any item size is not calculated (external change detected)
    const hasUncalculatedSizes = computed(
      () => this.items().some(item => !this.isItemSizeCalculated(item)),
      { equal: (_, b) => b === false }
    ) as Signal<void>;

    // Ensure min/max limits are respected on external changes and container resize
    afterRenderEffect(() => {
      hasUncalculatedSizes();
      this.containerSize();
      untracked(() => {
        // Skip during active drag — sizes are managed by the drag handler
        if (this.dragContext()) return;
        this.ensureMinMaxSizes();
      });
    });
  }

  // --- Public signals ---

  /** The active drag state, or `null` when idle. */
  public readonly dragContext = signal<ResizeDragContext | null>(null);

  /** Whether a drag operation is currently in progress. */
  public readonly isDragging = computed(() => this.dragContext() !== null);

  /**
   * Whether any completed (non-cancelled) drag has occurred in this engine's lifetime.
   *
   * Used by `push` mode to defer resolving `fr`/`%` → `px` until the first drag.
   * Before the first drag, original units are preserved so CSS grid can distribute
   * space without rounding-induced overflow.
   */
  public readonly hasBeenResized = signal(false);

  /**
   * CSS grid template string with item sizes interleaved with gap sizes.
   *
   * Example output: `"100px 4px minmax(50px, 2fr) 4px minmax(50px, 1fr)"`.
   *
   * **Output strategy per distribution mode:**
   * - `adjacent` — resolves all sizes to `px`. CSS grid cannot constrain adjacent
   *   resizing correctly with `fr` units.
   * - `proportional` — keeps `fr`/`%` as-is, wrapped in `minmax(floor, size)` when
   *   {@link minItemSizePx} > 0. This lets CSS grid redistribute remaining space
   *   while enforcing the minimum floor natively. Locked (`px`) columns pass through.
   * - `push` — keeps original units until the first completed drag, then resolves
   *   everything to `px` so the total can exceed the container and trigger scrolling.
   */
  public readonly gridTemplateSizes = computed(() => {
    const items = this.items();
    const gaps = this.gapSizes();

    if (items.length === 0) return 'none';

    const containerSize = this.containerSize();
    const constrained = this.containerConstrained();
    const mode = this.distributionMode();

    // Resolve strategy:
    // - adjacent (constrained): resolve ALL to px — CSS grid can't constrain adjacent resizing with fr.
    // - push (unconstrained): keep original units until first movement bakes to px, then resolve for scrolling.
    // - proportional: NEVER resolve fr→px. Use minmax(floor, size) so CSS grid handles min widths
    //   natively, both during and after drag. This allows columns that still have room to shrink
    //   while already-at-minimum columns stay at the floor.
    const shouldResolve =
      containerSize > 0 &&
      ((constrained && mode === 'adjacent') || (!constrained && this.hasBeenResized()));
    const useMinmax = mode === 'proportional' && this.minItemSizePx > 0;
    const frFactors = shouldResolve ? this.getCurrentFractionFactors() : null;

    const result: string[] = [];
    for (let i = 0; i < items.length; i++) {
      const size = items[i]!.size();
      const expanded = expandResizeSize(size);
      if (shouldResolve && expanded.unit !== 'px') {
        result.push(`${resolveSizeToPx(expanded, frFactors!.pxPerFr, containerSize)}px`);
      } else if (useMinmax && expanded.unit !== 'px') {
        result.push(`minmax(${this.minItemSizePx}px, ${size})`);
      } else {
        result.push(size);
      }
      if (i < gaps.length) {
        result.push(`${gaps[i] || 0}px`);
      }
    }
    return result.join(' ');
  });

  /**
   * The total gap size in pixels.
   */
  public readonly totalGapSize = computed(() =>
    this.gapSizes().reduce((acc, size) => acc + size, 0)
  );

  /**
   * Aggregated item sizes by unit.
   */
  private readonly totalItemSizes = computed(() =>
    this.items().reduce(
      (acc, item) => {
        const { unit, value } = expandResizeSize(item.size());
        acc[unit] += value;
        return acc;
      },
      { px: 0, fr: 0, '%': 0 }
    )
  );

  /**
   * Minimum total size of all items combined (as a CSS calc expression).
   */
  public readonly minTotalSize = computed(() => this.computeLimitTotalSize('minSize'));

  /**
   * Maximum total size of all items combined (as a CSS calc expression).
   */
  public readonly maxTotalSize = computed(() => this.computeLimitTotalSize('maxSize'));

  // --- Drag operations ---

  /**
   * Begins a drag at the given divider. Original sizes are saved for reverting
   * on no-op clicks or cancellation. In push mode, baking to `px` is deferred
   * to the first {@link drag} call to avoid a visual shift on mousedown.
   */
  public startDrag(dividerIndex: number, startPositionPx: number): void {
    const items = this.items();
    if (dividerIndex < 0 || items.length < 2 || dividerIndex >= items.length) return;

    const preBakeSizes = items.map(item => item.size());

    this.dragContext.set({
      dividerIndex,
      startPosition: startPositionPx,
      preBakeSizes,
      items: items.map(item => this.createContextItem(item)),
      fractionFactors: this.getCurrentFractionFactors(),
      percentPerPx: this.getCurrentPercentPerPx(),
      baked: this.containerConstrained(),
    });
  }

  /** Updates item sizes during an active drag based on the current pointer position. */
  public drag(dividerIndex: number, currentPositionPx: number): void {
    const ctx = this.dragContext();
    if (!ctx || ctx.dividerIndex !== dividerIndex) return;

    // In push mode, bake all items to px on the first movement so non-dragged
    // items keep their absolute widths. Deferred from startDrag to avoid a
    // visual column shift on mousedown (CSS Grid fr→px rounding mismatch).
    if (!ctx.baked) {
      this.bakeAllItemsToPx();
      ctx.items = this.items().map(item => this.createContextItem(item));
      ctx.fractionFactors = this.getCurrentFractionFactors();
      ctx.percentPerPx = this.getCurrentPercentPerPx();
      ctx.baked = true;
    }

    const pxDelta = currentPositionPx - ctx.startPosition;
    this.applyDelta(dividerIndex, pxDelta, ctx.items, ctx.fractionFactors, ctx.percentPerPx);
  }

  /**
   * Ends a drag. If cancelled or no movement occurred, sizes revert to their
   * pre-drag values (including undoing any push-mode baking). Otherwise,
   * post-drag finalization runs (commit mode or proportional locking).
   */
  public endDrag(dividerIndex: number, cancel: boolean): void {
    const ctx = this.dragContext();
    if (!ctx || ctx.dividerIndex !== dividerIndex) return;
    const hasMoved = ctx.items.some(ci => {
      const current = expandResizeSize(ci.item.size());
      return current.value !== ci.startSize.value || current.unit !== ci.startSize.unit;
    });

    if (cancel || !hasMoved) {
      // Reset to pre-bake sizes (restores original fr/% units on no-op clicks)
      ctx.items.forEach((ci, i) => ci.item.size.set(ctx.preBakeSizes[i]!));
    } else {
      this.finalizeResize(ctx);
      this.hasBeenResized.set(true);
    }

    this.dragContext.set(null);
  }

  /**
   * Applies a single instantaneous move (e.g. keyboard step) at the given divider.
   * Requires that the relevant items already have engine-calculated sizes.
   */
  public moveDivider(dividerIndex: number, pxDelta: number): void {
    const items = this.items();
    if (dividerIndex < 0 || items.length < 2 || dividerIndex >= items.length) return;

    // Check that relevant items have calculated sizes
    if (!this.isItemSizeCalculated(items[dividerIndex]!)) return;
    if (dividerIndex < items.length - 1 && !this.isItemSizeCalculated(items[dividerIndex + 1]!))
      return;

    const contextItems = items.map(item => this.createContextItem(item));
    this.applyDelta(
      dividerIndex,
      pxDelta,
      contextItems,
      this.getCurrentFractionFactors(),
      this.getCurrentPercentPerPx()
    );
  }

  /**
   * Clamps all items to their min/max constraints, respecting {@link minItemSizePx}.
   *
   * Called automatically via `afterRenderEffect` when item sizes change externally
   * or the container resizes. Skipped during an active drag (sizes are managed
   * by the drag handler). For `fr`-sized items, clamping is done iteratively
   * with redistribution to maintain total fraction balance.
   */
  public ensureMinMaxSizes(): void {
    const items = this.items();
    if (items.length === 0) return;

    const containerSize = this.containerSize();
    const itemSizes = items.map(item => {
      const expanded = expandResizeSize(item.size());
      return {
        item,
        size: { unit: expanded.unit, value: expanded.value },
        minSizePx: Math.max(this.minItemSizePx, getResizeLimitInPx(item.minSize(), containerSize)),
        maxSizePx: getResizeLimitInPx(item.maxSize(), containerSize),
      };
    });

    // Clamp px and % items
    for (const entry of itemSizes) {
      if (entry.size.unit === 'px') {
        entry.size.value = clamp(entry.size.value, entry.minSizePx, entry.maxSizePx);
      } else if (entry.size.unit === '%') {
        const pxValue = (entry.size.value / 100) * containerSize;
        if (pxValue < entry.minSizePx) {
          entry.size.value = (entry.minSizePx / containerSize) * 100;
        } else if (pxValue > entry.maxSizePx) {
          entry.size.value = (entry.maxSizePx / containerSize) * 100;
        }
      }
    }

    // Calculate fraction factors for fr-sized items
    const totalPx = itemSizes.reduce(
      (acc, { size }) => (size.unit === 'px' ? acc + size.value : acc),
      0
    );
    const totalPercent = itemSizes.reduce(
      (acc, { size }) => (size.unit === '%' ? acc + size.value : acc),
      0
    );
    const totalFr = itemSizes.reduce(
      (acc, { size }) => (size.unit === 'fr' ? acc + size.value : acc),
      0
    );

    const frArea =
      containerSize - this.totalGapSize() - totalPx - (totalPercent / 100) * containerSize;
    const frPerPx = totalFr / (frArea || 1);
    const pxPerFr = (frArea || 1) / (totalFr || 1);

    // Iteratively clamp fr-sized items and redistribute
    let frPanelsWithoutClamping = itemSizes.filter(p => p.size.unit === 'fr');
    let frToDistribute: number | undefined = undefined;
    while (frPanelsWithoutClamping.length > 0 && frToDistribute !== 0) {
      const frToAddPerPanel = frToDistribute ? frToDistribute / frPanelsWithoutClamping.length : 0;
      const next: typeof itemSizes = [];
      let currentTotalFrSize = totalFr;
      for (const p of frPanelsWithoutClamping) {
        const minSizeFr = p.minSizePx * frPerPx;
        const maxSizeFr = p.maxSizePx * frPerPx;
        p.size.value += frToAddPerPanel;
        if (p.size.value < minSizeFr) {
          currentTotalFrSize = currentTotalFrSize - p.size.value + minSizeFr;
          p.size.value = minSizeFr;
        } else if (p.size.value > maxSizeFr) {
          currentTotalFrSize = currentTotalFrSize - p.size.value + maxSizeFr;
          p.size.value = maxSizeFr;
        } else {
          next.push(p);
        }
      }
      frToDistribute = totalFr - currentTotalFrSize;
      if (Math.abs(frToDistribute * pxPerFr) < 1) {
        frToDistribute = 0;
      }
      frPanelsWithoutClamping = next;
    }

    // Write back
    for (const { item, size } of itemSizes) {
      this.setItemSize(item, `${size.value}${size.unit}`);
    }
  }

  // --- Item size tracking ---

  /**
   * Sets the item's size and marks it as engine-calculated via an internal symbol.
   * This mark is used by {@link isItemSizeCalculated} to detect external size changes.
   */
  public setItemSize(item: ResizableItem, size: ResizeSize): void {
    item.size.set(size);
    (item as ItemWithLastCalcSize)[LAST_CALC_SIZE_SYMBOL] = size;
  }

  /**
   * Returns `true` if the item's current size matches the last value written by the engine.
   * Returns `false` if the size was changed externally (e.g. by an input binding or state restore).
   */
  public isItemSizeCalculated(item: ResizableItem): boolean {
    return (item as ItemWithLastCalcSize)[LAST_CALC_SIZE_SYMBOL] === item.size();
  }

  // --- Private: delta application ---

  /**
   * Routes a px delta to the appropriate distribution strategy.
   *
   * For last-item edge resizing (dividerIndex === items.length - 1), the delta is
   * remapped to the previous divider with negated direction. This allows the last
   * column's handle in push mode to resize it directly.
   */
  private applyDelta(
    dividerIndex: number,
    pxDelta: number,
    items: ResizeDragContextItem[],
    fractionFactors: ResizeFractionFactors,
    percentPerPx: number
  ): void {
    const mode = this.distributionMode();

    // Right-edge resize of the last item: remap to the previous divider with negated delta.
    const isLastItemEdge = dividerIndex === items.length - 1;
    const effectiveDividerIndex = isLastItemEdge ? dividerIndex - 1 : dividerIndex;
    const effectiveDelta = isLastItemEdge ? -pxDelta : pxDelta;

    if (mode === 'push' && !this.containerConstrained()) {
      this.applyPushDelta(dividerIndex, pxDelta, items, fractionFactors, percentPerPx);
    } else if (mode === 'proportional') {
      this.applyProportionalDelta(effectiveDividerIndex, effectiveDelta, items, fractionFactors);
    } else {
      this.applyAdjacentDelta(
        effectiveDividerIndex,
        effectiveDelta,
        items,
        fractionFactors,
        percentPerPx
      );
    }
  }

  /**
   * Adjacent mode: transfers the delta between the two items neighbouring the divider.
   *
   * Grows the left item and shrinks the right item (or vice versa). When an item
   * hits its min/max constraint, the unapplied remainder cascades to the next item
   * in that direction. A second pass resolves any asymmetry between left and right.
   * The total container width is always preserved (zero-sum).
   */
  private applyAdjacentDelta(
    dividerIndex: number,
    pxDelta: number,
    items: ResizeDragContextItem[],
    fractionFactors: ResizeFractionFactors,
    percentPerPx: number
  ): void {
    const containerSize = this.containerSize();
    const appliedPanelDeltas: number[] = Array(items.length).fill(0);

    const recursion = (pxDelta: number, itemIndex: number, itemIndexIncrement: number): number => {
      if (itemIndex >= items.length || itemIndex < 0) return 0;
      const ci = items[itemIndex]!;

      const startPx = resolveSizeToPx(ci.startSize, fractionFactors.pxPerFr, containerSize);
      const newPx = startPx + pxDelta;
      const limitPx = getLimitPxForDelta(ci, pxDelta, containerSize, this.minItemSizePx);
      const unappliedDelta =
        pxDelta < 0
          ? limitPx > newPx
            ? -(limitPx - newPx)
            : 0
          : limitPx < newPx
            ? newPx - limitPx
            : 0;

      const appliedDelta = pxDelta - unappliedDelta;
      appliedPanelDeltas[itemIndex] = appliedDelta;

      return unappliedDelta === 0
        ? pxDelta
        : appliedDelta +
            recursion(unappliedDelta, itemIndex + itemIndexIncrement, itemIndexIncrement);
    };

    let appliedLeft = recursion(pxDelta, dividerIndex, -1);
    let appliedRight = -recursion(-pxDelta, dividerIndex + 1, 1);

    if (appliedLeft !== pxDelta || appliedRight !== pxDelta) {
      const resolvedDelta =
        pxDelta < 0 ? Math.max(appliedLeft, appliedRight) : Math.min(appliedLeft, appliedRight);
      appliedPanelDeltas.fill(0);
      appliedLeft = recursion(resolvedDelta, dividerIndex, -1);
      appliedRight = -recursion(-resolvedDelta, dividerIndex + 1, 1);

      if (appliedLeft !== resolvedDelta || appliedRight !== resolvedDelta) {
        return;
      }
    }

    this.commitItemDeltas(items, appliedPanelDeltas, fractionFactors, percentPerPx);
  }

  /**
   * Proportional mode: only the item at `dividerIndex` changes size (set to absolute `px`).
   * All other items keep their original units (`fr`, `%`), and CSS grid's `minmax(floor, size)`
   * naturally redistributes the remaining space — columns with room shrink while those
   * already at the floor stay put.
   *
   * Growth is capped so the total never overflows the container: each other `fr` column
   * needs at least {@link minItemSizePx}, and locked `px` columns keep their size.
   *
   * After the drag ends, {@link applyProportionalLocking} determines whether the
   * resized column stays as `px` (locked) or is converted back to `fr` (dynamic).
   */
  private applyProportionalDelta(
    dividerIndex: number,
    pxDelta: number,
    items: ResizeDragContextItem[],
    fractionFactors: ResizeFractionFactors
  ): void {
    const containerSize = this.containerSize();
    const floor = this.minItemSizePx;
    const item = items[dividerIndex]!;
    const startPx = resolveSizeToPx(item.startSize, fractionFactors.pxPerFr, containerSize);

    // Clamp to own min/max
    let newPx = clampToLimits(startPx + pxDelta, item, containerSize, floor);

    // Cap so the total doesn't overflow. With minmax(floor, Xfr), each other
    // column needs at least `floor` px. Locked px columns keep their size.
    if (floor > 0) {
      const totalGaps = this.totalGapSize();
      let otherLockedPx = 0;
      let otherFrCount = 0;
      for (let i = 0; i < items.length; i++) {
        if (i === dividerIndex) continue;
        const { unit, value } = expandResizeSize(items[i]!.item.size());
        if (unit === 'px') {
          otherLockedPx += value;
        } else {
          otherFrCount++;
        }
      }
      newPx = Math.min(newPx, containerSize - totalGaps - otherLockedPx - otherFrCount * floor);
    }

    this.setItemSize(item.item, `${Math.max(0, newPx)}px`);
  }

  /**
   * Push mode: only the dragged item changes size. All other items stay at their
   * baked `px` values (set during {@link startDrag}). The container total changes,
   * causing horizontal overflow/scrolling. Only valid when `containerConstrained` is `false`.
   */
  private applyPushDelta(
    dividerIndex: number,
    pxDelta: number,
    items: ResizeDragContextItem[],
    fractionFactors: ResizeFractionFactors,
    percentPerPx: number
  ): void {
    const containerSize = this.containerSize();
    const appliedPanelDeltas: number[] = Array(items.length).fill(0);
    const item = items[dividerIndex]!;
    const startPx = resolveSizeToPx(item.startSize, fractionFactors.pxPerFr, containerSize);

    appliedPanelDeltas[dividerIndex] =
      clampToLimits(startPx + pxDelta, item, containerSize, this.minItemSizePx) - startPx;

    this.commitItemDeltas(items, appliedPanelDeltas, fractionFactors, percentPerPx);
  }

  // --- Private: post-drag finalization ---

  /**
   * Post-drag finalization. Behaviour depends on {@link lockSizes} and the distribution mode.
   *
   * When `lockSizes` is `false`:
   * - `adjacent` / `push` — no-op; items keep their original units.
   * - `proportional` — the resized column is converted back to `fr` so it stays dynamic.
   *
   * When `lockSizes` is `true`:
   * - `adjacent` / `push` — items whose size changed are converted to absolute `px`.
   * - `proportional` — no-op; the resized column is already `px` from the drag.
   */
  private finalizeResize(ctx: ResizeDragContext): void {
    const lock = this.lockSizes();

    if (this.distributionMode() === 'proportional') {
      if (!lock) this.unlockProportionalColumn(ctx);
      return;
    }

    // Adjacent / push: lock affected items to px when enabled
    if (!lock) return;

    const containerSize = this.containerSize();
    const fractionFactors = this.getCurrentFractionFactors();

    for (const ci of ctx.items) {
      const currentSize = expandResizeSize(ci.item.size());
      const sizeChanged =
        currentSize.value !== ci.startSize.value || currentSize.unit !== ci.startSize.unit;
      if (sizeChanged) {
        const pxValue = resolveSizeToPx(currentSize, fractionFactors.pxPerFr, containerSize);
        this.setItemSize(ci.item, `${Math.max(0, pxValue)}px`);
      }
    }
  }

  /**
   * Converts the resized column back to `fr` after a proportional drag so it
   * continues to flex with the container. Computes a new `fr` value that would
   * resolve to the same pixel width given the current container and other `fr` columns.
   */
  private unlockProportionalColumn(ctx: ResizeDragContext): void {
    const items = ctx.items;
    const containerSize = this.containerSize();
    const resizedItem = items[ctx.dividerIndex]!;
    const resizedPx = expandResizeSize(resizedItem.item.size()).value;

    // Sum up all other fr values (from pre-bake, since they weren't changed)
    let otherFrTotal = 0;
    let otherPxTotal = 0;
    for (let i = 0; i < items.length; i++) {
      if (i === ctx.dividerIndex) continue;
      const preBake = expandResizeSize(ctx.preBakeSizes[i]!);
      if (preBake.unit === 'fr') {
        otherFrTotal += preBake.value;
      } else if (preBake.unit === 'px') {
        otherPxTotal += preBake.value;
      }
    }

    const availableForFr = containerSize - this.totalGapSize() - otherPxTotal;

    if (otherFrTotal > 0 && availableForFr > resizedPx) {
      // Solve: newFr / otherFrTotal = resizedPx / (availableForFr - resizedPx)
      const newFr = (resizedPx * otherFrTotal) / (availableForFr - resizedPx);
      this.setItemSize(resizedItem.item, `${Math.max(0, +newFr.toFixed(4))}fr`);
    }
    // If we can't compute a valid fr (edge case), leave as px
  }

  // --- Private: helpers ---

  private createContextItem(item: ResizableItem): ResizeDragContextItem {
    return {
      item,
      startSize: expandResizeSize(item.size()),
      minSize: expandResizeLimit(item.minSize()),
      maxSize: expandResizeLimit(item.maxSize()),
    };
  }

  private getCurrentFractionFactors(): ResizeFractionFactors {
    const totals = this.totalItemSizes();
    const cs = this.containerSize();
    const percentPx = (totals['%'] / 100) * cs;
    const frArea = cs - this.totalGapSize() - totals.px - percentPx || 1;
    const totalFr = totals.fr || 1;
    return {
      frPerPx: totalFr / frArea,
      pxPerFr: frArea / totalFr,
    };
  }

  private getCurrentPercentPerPx(): number {
    return 100 / (this.containerSize() || 1);
  }

  /**
   * Bakes all non-px items to absolute px values. Used by push mode on first drag movement.
   * Prefers DOM-measured sizes (via {@link resolveItemSizes}) over JS-computed conversions
   * to avoid sub-pixel mismatches with CSS Grid's internal track sizing.
   */
  private bakeAllItemsToPx(): void {
    const items = this.items();
    const measured = this.resolveItemSizes?.();

    if (measured && measured.length === items.length) {
      for (let i = 0; i < items.length; i++) {
        this.setItemSize(items[i]!, `${measured[i]!}px`);
      }
    } else {
      const frFactors = this.getCurrentFractionFactors();
      const containerSize = this.containerSize();
      for (const item of items) {
        const size = expandResizeSize(item.size());
        if (size.unit !== 'px') {
          this.setItemSize(item, `${resolveSizeToPx(size, frFactors.pxPerFr, containerSize)}px`);
        }
      }
    }
  }

  /**
   * Writes computed px deltas back to items, converting to each item's original unit.
   */
  private commitItemDeltas(
    items: ResizeDragContextItem[],
    appliedPanelDeltas: number[],
    fractionFactors: ResizeFractionFactors,
    percentPerPx: number
  ): void {
    items.forEach((ci, i) => {
      const pxDelta = appliedPanelDeltas[i] || 0;
      const unitDelta = pxDeltaToUnitDelta(
        pxDelta,
        ci.startSize.unit,
        fractionFactors.frPerPx,
        percentPerPx
      );
      const newValue = ci.startSize.value + unitDelta;
      this.setItemSize(ci.item, `${Math.max(0, newValue)}${ci.startSize.unit}`);
    });
  }

  /**
   * Builds a CSS `calc()` expression summing all items' min or max limits.
   * Items already in `px` contribute their current size; `fr`/`%` items contribute
   * their `minSize`/`maxSize` limit. Used by {@link minTotalSize} and {@link maxTotalSize}.
   */
  private computeLimitTotalSize(limitProp: 'minSize' | 'maxSize'): string {
    const { px, '%': pc } = this.items().reduce(
      (acc, item) => {
        const { unit, value } = expandResizeSize(item.size());
        if (unit === 'px') {
          acc.px += value;
        } else {
          const limitStr = item[limitProp]();
          acc[getResizeLimitUnit(limitStr)] += getResizeLimitValue(limitStr);
        }
        return acc;
      },
      { px: 0, '%': 0 }
    );
    return `calc(${px + this.totalGapSize()}px + ${pc}%)`;
  }
}

// --- Module-level helpers ---

/** Clamps a value between min and max. */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Resolves an expanded limit to px. */
function limitToPx(limit: ExpandedResizeLimit, containerSize: number): number {
  return limit.unit === 'px' ? limit.value : (limit.value / 100) * containerSize;
}

/**
 * Resolves a min limit to px, enforcing the given absolute floor.
 * Even if a relative limit (e.g. `5%`) resolves to less than the floor, the floor wins.
 */
function minLimitToPx(limit: ExpandedResizeLimit, containerSize: number, floorPx: number): number {
  return Math.max(floorPx, limitToPx(limit, containerSize));
}

/** Clamps a px value to the item's min/max limits (with floor on min). */
function clampToLimits(
  px: number,
  ci: ResizeDragContextItem,
  containerSize: number,
  floorPx: number
): number {
  return clamp(
    px,
    minLimitToPx(ci.minSize, containerSize, floorPx),
    limitToPx(ci.maxSize, containerSize)
  );
}

/**
 * Returns the relevant limit (min or max) in px for the direction of a delta.
 * Negative delta → min limit (with floor), positive delta → max limit.
 */
function getLimitPxForDelta(
  ci: ResizeDragContextItem,
  pxDelta: number,
  containerSize: number,
  floorPx: number
): number {
  return pxDelta < 0
    ? minLimitToPx(ci.minSize, containerSize, floorPx)
    : limitToPx(ci.maxSize, containerSize);
}
