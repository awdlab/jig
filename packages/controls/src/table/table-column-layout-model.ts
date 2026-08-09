import { afterRenderEffect, computed, signal } from '@angular/core';
import { elementSizeSignal } from '@awdlab/jig/api/ng';
import { getResizeLimitInPx, ResizeEngine } from '@awdlab/jig/api/resize';

import type { AwdTableTh } from './table-header-cell';
import type { ElementRef, ModelSignal, Signal } from '@angular/core';
import type { ResizableItem } from '@awdlab/jig/api/resize';

/**
 * Default minimum column width in pixels for table columns.
 * Enforced as an absolute floor even when a relative min-size (e.g. `5%`) resolves smaller.
 */
const TABLE_MIN_COLUMN_WIDTH_PX = 50;

/** Splits a CSS grid-template-columns string into individual track values, handling minmax(). */
const GRID_TRACK_RE = /(?:minmax\([^)]+\)|[^\s]+)/g;

export interface TableColumnLayoutModelDeps {
  element: ElementRef<HTMLElement>;
  resizable: Signal<boolean>;
  reorderable: Signal<boolean>;
  resizeMode: Signal<'adjacent' | 'proportional' | 'push'>;
  lockSizes: Signal<boolean>;
  columnOrder: ModelSignal<string[]>;
  themeClass: (name: string) => string;
}

/**
 * Owns all column geometry for {@link AwdTable}: effective order, widths (via the wrapped
 * {@link ResizeEngine}), sticky columns, reorder gestures, auto-sizing, and the composed
 * `grid-template-columns`. Reads table flags through injected signals; writes only its own
 * state and the injected `columnOrder` model.
 */
export class TableColumnLayoutModel {
  private readonly _registeredHeaderCells = signal<AwdTableTh[]>([]);
  private readonly _stickyColumns = signal<ReadonlyMap<string, 'start' | 'end'>>(new Map());
  private readonly _hasSelectionColumn = signal(false);
  private readonly _isReordering = signal(false);
  private readonly _reorderSourceColumnId = signal<string | null>(null);
  private readonly _dropIndicatorState = signal<{
    leftPx: number;
    topPx: number;
    heightPx: number;
  } | null>(null);
  private _reorderTargetIndex = -1;

  private readonly _tableElementSize: ReturnType<typeof elementSizeSignal>;
  private readonly _resizeEngine: ResizeEngine;

  public readonly hasSelectionColumn = this._hasSelectionColumn.asReadonly();
  public readonly isReordering = this._isReordering.asReadonly();
  public readonly dropIndicatorState = this._dropIndicatorState.asReadonly();
  public readonly isDragging = (): boolean => this._resizeEngine.isDragging();

  public readonly columnCount = computed(() => this._registeredHeaderCells().length);

  /**
   * Effective column order: merges user-provided `columnOrder` with registered header cells.
   * If `columnOrder` is empty, falls back to registration order.
   * Unknown keys are filtered; new columns not in the order are appended.
   */
  private readonly _effectiveColumnOrder = computed<string[]>(() => {
    const cells = this._registeredHeaderCells();
    const cellIds = cells.map(c => c.ngnTableTh());
    const userOrder = this._deps.columnOrder();

    if (!userOrder.length) {
      return cellIds;
    }

    // Filter to valid keys and append any new columns not in the order
    const validOrder = userOrder.filter(id => cellIds.includes(id));
    const missing = cellIds.filter(id => !validOrder.includes(id));
    return [...validOrder, ...missing];
  });

  public readonly stickyStartColumns = computed<string[]>(() => {
    const stickyMap = this._stickyColumns();
    const order = this._effectiveColumnOrder();
    const contiguous: string[] = [];
    for (const id of order) {
      if (stickyMap.get(id) === 'start') {
        contiguous.push(id);
      } else {
        break;
      }
    }
    return contiguous;
  });

  public readonly stickyEndColumns = computed<string[]>(() => {
    const stickyMap = this._stickyColumns();
    const order = this._effectiveColumnOrder();
    const contiguous: string[] = [];
    for (let i = order.length - 1; i >= 0; i--) {
      if (stickyMap.get(order[i]!) === 'end') {
        contiguous.unshift(order[i]!);
      } else {
        break;
      }
    }
    return contiguous;
  });

  /**
   * Maps column ID → 1-based visual position.
   */
  public readonly columnOrderMap = computed<ReadonlyMap<string, number>>(() => {
    const order = this._effectiveColumnOrder();
    const map = new Map<string, number>();
    for (let i = 0; i < order.length; i++) {
      map.set(order[i]!, i + 1);
    }
    return map;
  });

  /**
   * Grid template columns computed from the resize engine when resizable,
   * otherwise falls back to the standard equal-width repeat.
   */
  public readonly gridTemplateColumns: Signal<string>;

  constructor(private readonly _deps: TableColumnLayoutModelDeps) {
    this._tableElementSize = elementSizeSignal(this._deps.element);

    // Create engine eagerly in constructor (outside reactive context) to avoid NG0602
    this._resizeEngine = new ResizeEngine({
      items: computed(() => this._registeredHeaderCells() as unknown as readonly ResizableItem[]),
      containerSize: computed(() => {
        // Subscribe to the size signal for reactivity, but use clientWidth
        // to exclude vertical scrollbar width and avoid horizontal overflow.
        this._tableElementSize();
        const tableEl = this._deps.element.nativeElement.querySelector('table');
        const total = tableEl?.clientWidth ?? 0;
        if (!this._hasSelectionColumn()) return total;
        // Subtract the selection column width so the resize engine only distributes
        // the remaining space among data columns.
        const selCol = this._deps.element.nativeElement.querySelector(
          `.${this._deps.themeClass('selection-column')}`
        );
        return total - (selCol?.getBoundingClientRect().width ?? 0);
      }),
      gapSizes: signal([]),
      distributionMode: computed(() => this._deps.resizeMode()),
      containerConstrained: computed(() => this._deps.resizeMode() !== 'push'),
      lockSizes: computed(() => this._deps.lockSizes()),
      minItemSizePx: TABLE_MIN_COLUMN_WIDTH_PX,
      resolveItemSizes: () =>
        this._registeredHeaderCells().map(
          cell => cell.element.nativeElement.getBoundingClientRect().width
        ),
    });

    this.gridTemplateColumns = computed(() => {
      const checkboxCol = this._hasSelectionColumn() ? 'min-content ' : '';
      if (this._deps.resizable()) {
        const rawSizes = this._resizeEngine.gridTemplateSizes();
        // When reorderable, permute grid track sizes to match visual column order
        if (this._deps.reorderable()) {
          return `${checkboxCol}${this._permuteGridSizes(rawSizes)}`;
        }
        return `${checkboxCol}${rawSizes}`;
      }
      return `${checkboxCol}repeat(${this.columnCount()}, 1fr)`;
    });

    afterRenderEffect(() => {
      const startCols = this.stickyStartColumns();
      const endCols = this.stickyEndColumns();
      if (startCols.length === 0 && endCols.length === 0) return;
      if (this._resizeEngine.isDragging()) return;
      this._tableElementSize();

      const tableEl = this._deps.element.nativeElement.querySelector(':scope > table');
      if (!tableEl) return;

      const cells = this._registeredHeaderCells();

      let selectionWidth = 0;
      if (this._hasSelectionColumn()) {
        const selCol = tableEl.querySelector(`.${this._deps.themeClass('selection-column')}`);
        selectionWidth = selCol?.getBoundingClientRect().width ?? 0;
      }

      let cumulativeLeft = selectionWidth;
      for (let i = 0; i < startCols.length; i++) {
        (tableEl as HTMLElement).style.setProperty(
          `--jig-sticky-start-offset-${i}`,
          `${cumulativeLeft}px`
        );
        const cell = cells.find(c => c.ngnTableTh() === startCols[i]);
        cumulativeLeft += cell?.element.nativeElement.getBoundingClientRect().width ?? 0;
      }

      let cumulativeRight = 0;
      for (let i = endCols.length - 1; i >= 0; i--) {
        (tableEl as HTMLElement).style.setProperty(
          `--jig-sticky-end-offset-${i}`,
          `${cumulativeRight}px`
        );
        const cell = cells.find(c => c.ngnTableTh() === endCols[i]);
        cumulativeRight += cell?.element.nativeElement.getBoundingClientRect().width ?? 0;
      }
    });
  }

  /**
   * Returns the 1-based visual column index for a given 0-based logical (DOM) index.
   */
  public getVisualColumnIndex(logicalIndex: number): number {
    const cells = this._registeredHeaderCells();
    const cell = cells[logicalIndex];
    if (!cell) return logicalIndex + 1;
    return this.columnOrderMap().get(cell.ngnTableTh()) ?? logicalIndex + 1;
  }

  public registerSelectionColumn(): void {
    this._hasSelectionColumn.set(true);
  }

  public unregisterSelectionColumn(): void {
    this._hasSelectionColumn.set(false);
  }

  public registerHeaderCell(cell: AwdTableTh): void {
    this._registeredHeaderCells.update(cells => [...cells, cell]);
  }

  public unregisterHeaderCell(cell: AwdTableTh): void {
    this._registeredHeaderCells.update(cells => cells.filter(c => c !== cell));
  }

  public getRegisteredHeaderCells(): readonly AwdTableTh[] {
    return this._registeredHeaderCells();
  }

  public registerStickyColumn(columnId: string, side: 'start' | 'end'): void {
    this._stickyColumns.update(map => {
      const next = new Map(map);
      next.set(columnId, side);
      return next;
    });
  }

  public unregisterStickyColumn(columnId: string): void {
    this._stickyColumns.update(map => {
      const next = new Map(map);
      next.delete(columnId);
      return next;
    });
  }

  public getStickyInfo(
    columnId: string
  ): { side: 'start' | 'end'; index: number; isEdge: boolean } | null {
    const startCols = this.stickyStartColumns();
    const endCols = this.stickyEndColumns();
    const startIndex = startCols.indexOf(columnId);
    if (startIndex >= 0) {
      return { side: 'start', index: startIndex, isEdge: startIndex === startCols.length - 1 };
    }
    const endIndex = endCols.indexOf(columnId);
    if (endIndex >= 0) {
      return { side: 'end', index: endIndex, isEdge: endIndex === 0 };
    }
    return null;
  }

  // --- Resize operations (called by AwdTableTh) ---

  public startColumnResize(columnIndex: number, event: PointerEvent): void {
    if (!this._deps.resizable()) return;
    this._resizeEngine.startDrag(columnIndex, event.clientX);
  }

  public dragColumnResize(columnIndex: number, event: PointerEvent): void {
    if (!this._deps.resizable()) return;
    this._resizeEngine.drag(columnIndex, event.clientX);
  }

  public endColumnResize(columnIndex: number, cancel: boolean): void {
    if (!this._deps.resizable()) return;
    this._resizeEngine.endDrag(columnIndex, cancel);
  }

  // --- Reorder operations (called by AwdTableReorderableColumn) ---

  public getReorderBounds(columnId: string): { min: number; max: number } {
    const order = this._effectiveColumnOrder();
    const startCols = this.stickyStartColumns();
    const endCols = this.stickyEndColumns();
    const side = this._stickyColumns().get(columnId);

    if (side === 'start') {
      return { min: 0, max: startCols.length };
    } else if (side === 'end') {
      return { min: order.length - endCols.length, max: order.length };
    } else {
      return { min: startCols.length, max: order.length - endCols.length };
    }
  }

  public startColumnReorder(columnId: string): void {
    if (!this._deps.reorderable()) return;
    this._isReordering.set(true);
    this._reorderSourceColumnId.set(columnId);
    this._reorderTargetIndex = -1;
  }

  public dragColumnReorder(event: PointerEvent): void {
    if (!this._deps.reorderable() || !this._isReordering()) return;

    const cells = this._registeredHeaderCells();
    const effectiveOrder = this._effectiveColumnOrder();
    const sourceId = this._reorderSourceColumnId();
    if (!sourceId) return;

    // Find drop target by comparing cursor X to header cell midpoints (in visual order)
    const cursorX = event.clientX;
    let targetIndex = effectiveOrder.length;

    // Build visual-order cells with their bounding boxes
    const visualCells = effectiveOrder
      .map(id => cells.find(c => c.ngnTableTh() === id))
      .filter((c): c is AwdTableTh => !!c);

    for (let i = 0; i < visualCells.length; i++) {
      const rect = visualCells[i]!.element.nativeElement.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      if (cursorX < midX) {
        targetIndex = i;
        break;
      }
    }

    const bounds = this.getReorderBounds(sourceId);
    targetIndex = Math.max(bounds.min, Math.min(bounds.max, targetIndex));

    this._reorderTargetIndex = targetIndex;

    // Compute indicator position relative to the table element
    const tableEl = this._deps.element.nativeElement.querySelector(':scope > table');
    if (!tableEl) return;
    const tableRect = tableEl.getBoundingClientRect();

    // Use the first header cell's height for the indicator
    const firstCellRect = visualCells[0]?.element.nativeElement.getBoundingClientRect();
    const indicatorHeight = firstCellRect?.height ?? 40;

    let indicatorLeftPx: number;
    if (targetIndex === 0) {
      const firstCell = visualCells[0];
      if (!firstCell) return;
      const rect = firstCell.element.nativeElement.getBoundingClientRect();
      indicatorLeftPx = rect.left - tableRect.left;
    } else if (targetIndex >= visualCells.length) {
      const lastCell = visualCells[visualCells.length - 1];
      if (!lastCell) return;
      const rect = lastCell.element.nativeElement.getBoundingClientRect();
      indicatorLeftPx = rect.right - tableRect.left;
    } else {
      const prevCell = visualCells[targetIndex - 1]!;
      const nextCell = visualCells[targetIndex]!;
      const prevRect = prevCell.element.nativeElement.getBoundingClientRect();
      const nextRect = nextCell.element.nativeElement.getBoundingClientRect();
      indicatorLeftPx = (prevRect.right + nextRect.left) / 2 - tableRect.left;
    }

    // Clamp so the 3px-wide indicator stays within the visible content area
    // (use clientWidth to exclude scrollbar width from the boundary)
    const maxLeft = tableEl.clientWidth - 3;
    indicatorLeftPx = Math.max(0, Math.min(indicatorLeftPx, maxLeft));

    this._dropIndicatorState.set({
      leftPx: indicatorLeftPx,
      topPx: tableEl.scrollTop,
      heightPx: indicatorHeight,
    });
  }

  public endColumnReorder(cancel: boolean): void {
    if (!this._deps.reorderable()) return;

    if (!cancel && this._reorderTargetIndex >= 0) {
      const sourceId = this._reorderSourceColumnId();
      if (sourceId) {
        const effectiveOrder = [...this._effectiveColumnOrder()];
        const sourceIndex = effectiveOrder.indexOf(sourceId);

        if (sourceIndex >= 0) {
          // Remove source from its current position
          effectiveOrder.splice(sourceIndex, 1);
          // Adjust target index if source was before target
          let insertAt = this._reorderTargetIndex;
          if (sourceIndex < this._reorderTargetIndex) {
            insertAt--;
          }
          // Insert at new position
          effectiveOrder.splice(insertAt, 0, sourceId);

          this._deps.columnOrder.set(effectiveOrder);
        }
      }
    }

    this._isReordering.set(false);
    this._reorderSourceColumnId.set(null);
    this._dropIndicatorState.set(null);
    this._reorderTargetIndex = -1;
  }

  public getReorderSourceColumnId(): string | null {
    return this._reorderSourceColumnId();
  }

  /**
   * Permutes grid template sizes from logical (registration) order to visual (column order) order.
   */
  private _permuteGridSizes(rawSizes: string): string {
    const tracks = rawSizes.match(GRID_TRACK_RE) ?? [];
    const cells = this._registeredHeaderCells();
    const effectiveOrder = this._effectiveColumnOrder();

    if (tracks.length !== cells.length) {
      return rawSizes; // Mismatch — don't permute
    }

    // Build map: column ID → track size (logical order)
    const sizeByColumnId = new Map<string, string>();
    for (let i = 0; i < cells.length; i++) {
      sizeByColumnId.set(cells[i]!.ngnTableTh(), tracks[i]!);
    }

    // Emit sizes in visual order
    return effectiveOrder.map(id => sizeByColumnId.get(id) ?? '1fr').join(' ');
  }

  /**
   * Auto-sizes the column at `columnIndex` to fit its visible content.
   * Uses `Canvas.measureText()` for fast, reflow-free text measurement since
   * grid-constrained cells (`min-width: 0`) don't report natural content width
   * via `scrollWidth`.
   */
  public autoSizeColumn(columnIndex: number): void {
    if (!this._deps.resizable()) return;

    const cells = this._registeredHeaderCells();
    const headerCell = cells[columnIndex];
    if (!headerCell) return;

    const tableEl = this._deps.element.nativeElement.querySelector('table');
    if (!tableEl) return;

    const headerEl = headerCell.element.nativeElement as HTMLElement;
    const ctx = autoSizeCanvasCtx();

    // Measure header: text width + non-text siblings (icons, controls) + flex gap.
    // The header cell is a flex container with: cell-text, spacer, filter/sort icons, resize handle.
    const cellTextClass = this._deps.themeClass('cell-text');
    const headerTextEl = headerEl.querySelector<HTMLElement>(`.${cellTextClass}`);
    let headerRequiredWidth = 0;
    if (headerTextEl) {
      ctx.font = getCssFont(headerEl);
      const text = headerTextEl.textContent ?? '';
      headerRequiredWidth = Math.ceil(ctx.measureText(text).width);
    }
    // Add width of visible non-text siblings (filter icon, sort icon, etc.)
    const headerStyle = getComputedStyle(headerEl);
    const headerGap = parseFloat(headerStyle.gap) || 0;
    let visibleSiblingCount = 0;
    for (let i = 0; i < headerEl.children.length; i++) {
      const child = headerEl.children[i] as HTMLElement;
      if (child === headerTextEl) continue;
      // Skip spacer (zero intrinsic width) and hidden resize handle
      if (child.offsetWidth > 0 && getComputedStyle(child).flexGrow === '0') {
        headerRequiredWidth += child.offsetWidth;
        visibleSiblingCount++;
      }
    }
    // Add flex gaps between visible items
    if (visibleSiblingCount > 0) {
      headerRequiredWidth += headerGap * visibleSiblingCount;
    }
    let maxContentWidth = headerRequiredWidth;

    // Measure visible body cells (nth-child is 1-indexed, offset by selection column)
    const selectionOffset = this._hasSelectionColumn() ? 1 : 0;
    const bodyCells = Array.from(
      tableEl.querySelectorAll<HTMLElement>(
        `tbody tr td:nth-child(${columnIndex + selectionOffset + 1})`
      )
    );
    if (bodyCells.length > 0) {
      ctx.font = getCssFont(bodyCells[0]!);
      for (let i = 0; i < bodyCells.length; i++) {
        const text = bodyCells[i]!.textContent ?? '';
        maxContentWidth = Math.max(maxContentWidth, Math.ceil(ctx.measureText(text).width));
      }
    }

    // Add cell horizontal padding
    const paddingLeft = parseFloat(headerStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(headerStyle.paddingRight) || 0;
    const totalWidth = maxContentWidth + paddingLeft + paddingRight;

    // Clamp to min/max constraints
    const containerSize = this._tableElementSize().width;
    const minPx = Math.max(
      TABLE_MIN_COLUMN_WIDTH_PX,
      getResizeLimitInPx(headerCell.minSize(), containerSize)
    );
    const maxPx = getResizeLimitInPx(headerCell.maxSize(), containerSize);
    const clampedWidth = Math.max(minPx, Math.min(maxPx, totalWidth));

    this._resizeEngine.setItemSize(headerCell as unknown as ResizableItem, `${clampedWidth}px`);
    this._resizeEngine.hasBeenResized.set(true);
  }
}

// --- Auto-size helpers ---

/** Lazily created canvas context for text measurement (no DOM reflows). */
let _autoSizeCtx: CanvasRenderingContext2D | null = null;
function autoSizeCanvasCtx(): CanvasRenderingContext2D {
  if (!_autoSizeCtx) {
    _autoSizeCtx = document.createElement('canvas').getContext('2d')!;
  }
  return _autoSizeCtx;
}

/** Builds the CSS font shorthand from an element's computed style. */
function getCssFont(el: HTMLElement): string {
  const s = getComputedStyle(el);
  return `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
}
