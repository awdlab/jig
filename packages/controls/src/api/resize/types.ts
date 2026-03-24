import type { ModelSignal, Signal } from '@angular/core';

// --- Size units ---

export type ResizeSizeUnit = 'px' | 'fr' | '%';
export type ResizeSize<U extends ResizeSizeUnit = ResizeSizeUnit> = `${number}${U}`;

export type ResizeLimitUnit = 'px' | '%';
export type ResizeLimit<U extends ResizeLimitUnit = ResizeLimitUnit> = `${number}${U}`;

// --- Expanded (parsed) forms ---

export type ExpandedResizeSize = {
  value: number;
  unit: ResizeSizeUnit;
};

export type ExpandedResizeLimit = {
  value: number;
  unit: ResizeLimitUnit;
};

// --- Configuration ---

/**
 * How a resize delta is distributed across items.
 * - `adjacent` — zero-sum transfer between the two items neighbouring the divider.
 * - `proportional` — only the dragged item changes; other `fr`/`%` items redistribute via CSS grid.
 * - `push` — only the dragged item changes; the container total grows/shrinks (requires unconstrained container).
 */
export type ResizeDistributionMode = 'adjacent' | 'proportional' | 'push';

// --- Resizable item interface ---

/**
 * A control-agnostic interface representing a resizable item (panel, column, etc.).
 * Both splitter panels and table header cells implement this interface.
 */
export interface ResizableItem {
  /** The current size of the item (e.g. '100px', '1fr', '30%'). */
  size: ModelSignal<ResizeSize>;
  /** The minimum size constraint (e.g. '50px', '10%'). */
  minSize: Signal<ResizeLimit>;
  /** The maximum size constraint (e.g. '500px', '80%'). */
  maxSize: Signal<ResizeLimit>;
}

// --- Engine configuration ---

export interface ResizeEngineConfig {
  /** The resizable items (panels, columns, etc.). */
  items: Signal<readonly ResizableItem[]>;
  /** The total container size in pixels along the resize axis. */
  containerSize: Signal<number>;
  /** The pixel sizes of gaps between items (dividers, gutters). */
  gapSizes: Signal<readonly number[]>;
  /** How deltas are distributed across items during a resize. */
  distributionMode: Signal<ResizeDistributionMode>;
  /** Whether the total size is constrained to the container. If false, push mode can grow the total. */
  containerConstrained: Signal<boolean>;
  /**
   * Whether to convert affected items to fixed `px` values after a drag completes.
   *
   * - **`adjacent` / `push` modes**: when `true`, items whose size changed during the drag
   *   are converted from their original unit (`fr`, `%`) to absolute `px`. When `false`,
   *   items keep their original units.
   * - **`proportional` mode**: when `true`, the resized column stays as `px` (locked).
   *   When `false`, it is converted back to `fr` so it continues to flex with the container.
   *   Other columns are never affected.
   *
   * @default false
   */
  lockSizes?: Signal<boolean>;
  /**
   * Absolute minimum size in pixels for any item, enforced as a floor even when
   * a relative min-size (e.g. `5%`) resolves to a smaller value.
   *
   * Set to `0` to disable the floor (e.g. for splitter panels that have no inherent minimum).
   *
   * @default 0
   */
  minItemSizePx?: number;
  /**
   * Optional callback that returns the actual rendered px sizes of all items
   * (e.g. via `getBoundingClientRect().width`). When provided, push-mode baking
   * uses these DOM-measured values instead of JS-computed fr→px conversions,
   * avoiding sub-pixel rounding mismatches with CSS Grid.
   */
  resolveItemSizes?: () => number[];
}

// --- Internal drag state ---

/** Snapshot of a single item's state at the start of a drag. */
export type ResizeDragContextItem = {
  item: ResizableItem;
  /** Parsed size at drag start (after any push-mode baking). */
  startSize: ExpandedResizeSize;
  /** Parsed min-size constraint. */
  minSize: ExpandedResizeLimit;
  /** Parsed max-size constraint. */
  maxSize: ExpandedResizeLimit;
};

/** Full drag state captured at {@link ResizeEngine.startDrag}. */
export type ResizeDragContext = {
  /** Index of the divider being dragged. */
  dividerIndex: number;
  /** Pointer position (px) when the drag started. */
  startPosition: number;
  /** Original sizes before push-mode baking. Used to revert on no-op clicks or cancellation. */
  preBakeSizes: ResizeSize[];
  /** Snapshots of all items at drag start. */
  items: ResizeDragContextItem[];
  /** Fraction conversion factors captured at drag start. */
  fractionFactors: ResizeFractionFactors;
  /** Percent-per-pixel ratio captured at drag start. */
  percentPerPx: number;
  /** Whether push-mode baking has been applied (deferred to first movement). */
  baked: boolean;
};

export type ResizeFractionFactors = {
  /** Number of fraction units per pixel. */
  frPerPx: number;
  /** Number of pixels per fraction unit. */
  pxPerFr: number;
};
