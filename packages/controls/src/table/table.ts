import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
  booleanAttribute,
} from '@angular/core';
import { executeMultiFilter } from '@ngneers/controls/api';
import { elementSizeSignal, NgnTemplate } from '@ngneers/controls/api/ng';
import { ResizeEngine, getResizeLimitInPx, type ResizableItem } from '@ngneers/controls/api/resize';
import { NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnPaginator, type PaginationState } from '@ngneers/controls/paginator';
import { NgnScroller } from '@ngneers/controls/scroller';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTableTemplates } from './table-templates';

/**
 * Default minimum column width in pixels for table columns.
 * Enforced as an absolute floor even when a relative min-size (e.g. `5%`) resolves smaller.
 */
const TABLE_MIN_COLUMN_WIDTH_PX = 50;

/** Splits a CSS grid-template-columns string into individual track values, handling minmax(). */
const GRID_TRACK_RE = /(?:minmax\([^)]+\)|[^\s]+)/g;

import type { NgnTableTh } from './table-header-cell';
import type { FormattedTableRow } from './types';
import type { NgnFilterConfig } from '@ngneers/controls/filter';
import type { AllKeysOfUnion } from '@ngneers/controls/utils';

@Component({
  selector: 'ngn-table',
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NgnScroller, NgnPaginator, NgnTemplate, NgnPt],
  providers: [provideSelf(NgnTable)],
  host: {
    tabindex: '0',
  },
})
export class NgnTable<T extends object, K extends keyof T> extends NgnTableTemplates<T> {
  protected readonly theme = this.injectThemeTemplate(tableControlTemplate, {
    root: true,
    virtual: () => this.virtual(),
    resizing: () => this._resizeEngine?.isDragging() ?? false,
    reorderable: () => this.reorderable(),
    reordering: () => this._isReordering(),
  });
  private readonly _registeredHeaderCells = signal<NgnTableTh[]>([]);

  public readonly rows = input.required<readonly T[]>();
  public readonly rowHeight = input<number>();
  public readonly fieldId = input.required<K>();
  public readonly virtual = input<boolean>(false);
  public readonly virtualPadding = input<number>(2);
  public readonly striped = input<boolean>(false);
  public readonly paginator = input<boolean>(false);

  /**
   * Whether column resizing is enabled.
   * @default false
   */
  public readonly resizable = input(false, { transform: booleanAttribute });

  /**
   * The resize distribution mode.
   * - `'adjacent'`: Only columns adjacent to the resize handle change. Total width stays the same.
   * - `'push'`: Column grows/shrinks independently, total width changes (enables horizontal scrolling).
   * @default 'adjacent'
   */
  public readonly resizeMode = input<'adjacent' | 'proportional' | 'push'>('adjacent');

  /**
   * Whether to lock affected columns to fixed `px` values after a resize completes.
   *
   * - **`proportional` mode**: when `true`, the resized column stays as `px` (locked);
   *   when `false`, it is converted back to `fr` and continues to flex with the container.
   * - **`adjacent` / `push` modes**: when `true`, columns whose size changed are converted
   *   to `px`; when `false`, columns keep their original units.
   *
   * @default false
   */
  public readonly lockSizes = input<boolean>(false);

  /**
   * Whether column reordering is enabled.
   * @default false
   */
  public readonly reorderable = input(false, { transform: booleanAttribute });

  /**
   * The current column order as an array of column identifiers.
   * When empty, the natural registration order (DOM order) is used.
   * Supports two-way binding for persistence.
   */
  public readonly columnOrder = model<string[]>([]);

  protected readonly trackById = (item: T): unknown => item[this.fieldId()];
  public readonly sort = model<{
    column: Extract<AllKeysOfUnion<T>, string>;
    direction: 'asc' | 'desc';
  } | null>(null);
  public readonly filters = model<
    | {
        [key in Extract<AllKeysOfUnion<T>, string>]?: NgnFilterConfig;
      }
    | null
  >(null);
  protected readonly pageState = signal<PaginationState | null>(null);

  protected readonly formattedRows = computed<FormattedTableRow<T>[]>(() => {
    const rows = this._sortedRows();
    return rows.map((data, index) => ({
      kind: 'data' as const,
      id: data[this.fieldId()] as T[keyof T] & (string | number),
      data,
      index,
    }));
  });

  protected readonly pagedRows = computed<FormattedTableRow<T>[]>(() => {
    const paginator = this.paginator();
    if (!paginator) {
      return this.formattedRows();
    }
    const pageState = this.pageState();
    if (!pageState) {
      return [];
    }
    return this.formattedRows().slice(
      pageState.slice.skip,
      pageState.slice.take + pageState.slice.skip
    );
  });

  private readonly _filteredRows = computed<readonly T[]>(() => {
    const filters = this.filters();
    const rows = this.rows();
    if (!filters) {
      return rows;
    }
    return executeMultiFilter(rows, filters);
  });

  private readonly _sortedRows = computed<readonly T[]>(() => {
    const rows = this._filteredRows();
    const sort = this.sort();
    if (!sort) {
      return rows;
    }
    const { column, direction } = sort;
    // @jasc @todo outsource sorting & allow custom sort functions
    return rows.toSorted((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (aValue == null && bValue != null) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue != null && bValue == null) {
        return direction === 'asc' ? 1 : -1;
      }
      if (aValue == null && bValue == null) {
        return 0;
      }
      return typeof aValue === 'number' && typeof bValue === 'number'
        ? direction === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number)
        : direction === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
    });
  });

  protected readonly columnCount = computed(() => this._registeredHeaderCells().length);

  // --- Column reorder state ---

  private readonly _isReordering = signal(false);
  private readonly _reorderSourceColumnId = signal<string | null>(null);
  protected readonly _dropIndicatorState = signal<{
    leftPx: number;
    heightPx: number;
  } | null>(null);
  private _reorderTargetIndex = -1;

  /**
   * Effective column order: merges user-provided `columnOrder` with registered header cells.
   * If `columnOrder` is empty, falls back to registration order.
   * Unknown keys are filtered; new columns not in the order are appended.
   */
  private readonly _effectiveColumnOrder = computed<string[]>(() => {
    const cells = this._registeredHeaderCells();
    const cellIds = cells.map(c => c.ngnTableTh());
    const userOrder = this.columnOrder();

    if (!userOrder.length) {
      return cellIds;
    }

    // Filter to valid keys and append any new columns not in the order
    const validOrder = userOrder.filter(id => cellIds.includes(id));
    const missing = cellIds.filter(id => !validOrder.includes(id));
    return [...validOrder, ...missing];
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
   * Returns the 1-based visual column index for a given 0-based logical (DOM) index.
   */
  public getVisualColumnIndex(logicalIndex: number): number {
    const cells = this._registeredHeaderCells();
    const cell = cells[logicalIndex];
    if (!cell) return logicalIndex + 1;
    return this.columnOrderMap().get(cell.ngnTableTh()) ?? logicalIndex + 1;
  }

  // --- Resize engine ---

  private readonly _tableElementSize = elementSizeSignal(this.element);
  private readonly _resizeEngine: ResizeEngine;

  /**
   * Grid template columns computed from the resize engine when resizable,
   * otherwise falls back to the standard equal-width repeat.
   */
  protected readonly gridTemplateColumns: ReturnType<typeof computed<string>>;

  constructor() {
    super();

    // Create engine eagerly in constructor (outside reactive context) to avoid NG0602
    this._resizeEngine = new ResizeEngine({
      items: computed(() => this._registeredHeaderCells() as unknown as readonly ResizableItem[]),
      containerSize: computed(() => this._tableElementSize().width),
      gapSizes: signal([]),
      distributionMode: computed(() => this.resizeMode()),
      containerConstrained: computed(() => this.resizeMode() !== 'push'),
      lockSizes: computed(() => this.lockSizes()),
      minItemSizePx: TABLE_MIN_COLUMN_WIDTH_PX,
    });

    this.gridTemplateColumns = computed(() => {
      if (this.resizable()) {
        const rawSizes = this._resizeEngine.gridTemplateSizes();
        // When reorderable, permute grid track sizes to match visual column order
        if (this.reorderable()) {
          return this._permuteGridSizes(rawSizes);
        }
        return rawSizes;
      }
      return `repeat(${this.columnCount()}, 1fr)`;
    });

    this._pushTableWidth = computed(() => {
      if (!this.resizable() || this.resizeMode() !== 'push') return null;
      // Only use max-content after a resize has occurred, so CSS grid fr units
      // distribute properly against the full container width before any drag.
      return this._resizeEngine.hasBeenResized() || this._resizeEngine.isDragging()
        ? 'max-content'
        : null;
    });

    this._pushOverflowX = computed(() => {
      if (!this.resizable() || this.resizeMode() !== 'push') return 'hidden';
      // Only show scrollbar after a completed drag, not during — avoids the
      // scrollbar flashing on the instant the user starts dragging.
      return this._resizeEngine.hasBeenResized() ? 'auto' : 'hidden';
    });
  }

  /**
   * Computed table width style for push mode. `max-content` allows the grid to
   * exceed the container width, but only after a drag so fr units resolve correctly initially.
   */
  protected readonly _pushTableWidth: ReturnType<typeof computed<string | null>>;

  /**
   * Overflow-x for the push mode scroll wrapper. Only `auto` after a completed drag
   * (not during), so the scrollbar doesn't flash on the instant the user starts dragging.
   */
  protected readonly _pushOverflowX: ReturnType<typeof computed<string>>;

  protected pageChanged(event: PaginationState) {
    this.pageState.set(event);
  }

  public column<V extends AllKeysOfUnion<T> & string>(column: V): V {
    return column;
  }

  public registerHeaderCell(cell: NgnTableTh): void {
    this._registeredHeaderCells.update(cells => [...cells, cell]);
  }

  public unregisterHeaderCell(cell: NgnTableTh): void {
    this._registeredHeaderCells.update(cells => cells.filter(c => c !== cell));
  }

  public getRegisteredHeaderCells(): readonly NgnTableTh[] {
    return this._registeredHeaderCells();
  }

  // --- Resize operations (called by NgnTableTh) ---

  public startColumnResize(columnIndex: number, event: PointerEvent): void {
    if (!this.resizable()) return;
    this._resizeEngine.startDrag(columnIndex, event.clientX);
  }

  public dragColumnResize(columnIndex: number, event: PointerEvent): void {
    if (!this.resizable()) return;
    this._resizeEngine.drag(columnIndex, event.clientX);
  }

  public endColumnResize(columnIndex: number, cancel: boolean): void {
    if (!this.resizable()) return;
    this._resizeEngine.endDrag(columnIndex, cancel);
  }

  // --- Reorder operations (called by NgnTableReorderableColumn) ---

  public startColumnReorder(columnId: string): void {
    if (!this.reorderable()) return;
    this._isReordering.set(true);
    this._reorderSourceColumnId.set(columnId);
    this._reorderTargetIndex = -1;
  }

  public dragColumnReorder(event: PointerEvent): void {
    if (!this.reorderable() || !this._isReordering()) return;

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
      .filter((c): c is NgnTableTh => !!c);

    for (let i = 0; i < visualCells.length; i++) {
      const rect = visualCells[i]!.element.nativeElement.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      if (cursorX < midX) {
        targetIndex = i;
        break;
      }
    }

    this._reorderTargetIndex = targetIndex;

    // Compute indicator position relative to the outer wrapper div
    const wrapperEl = this.element.nativeElement.querySelector(':scope > div');
    if (!wrapperEl) return;
    const wrapperRect = wrapperEl.getBoundingClientRect();

    // Use the first header cell's height for the indicator
    const firstCellRect = visualCells[0]?.element.nativeElement.getBoundingClientRect();
    const indicatorHeight = firstCellRect?.height ?? 40;

    let indicatorLeftPx: number;
    if (targetIndex === 0) {
      const firstCell = visualCells[0];
      if (!firstCell) return;
      const rect = firstCell.element.nativeElement.getBoundingClientRect();
      indicatorLeftPx = rect.left - wrapperRect.left;
    } else if (targetIndex >= visualCells.length) {
      const lastCell = visualCells[visualCells.length - 1];
      if (!lastCell) return;
      const rect = lastCell.element.nativeElement.getBoundingClientRect();
      indicatorLeftPx = rect.right - wrapperRect.left;
    } else {
      const prevCell = visualCells[targetIndex - 1]!;
      const nextCell = visualCells[targetIndex]!;
      const prevRect = prevCell.element.nativeElement.getBoundingClientRect();
      const nextRect = nextCell.element.nativeElement.getBoundingClientRect();
      indicatorLeftPx = (prevRect.right + nextRect.left) / 2 - wrapperRect.left;
    }

    // Clamp so the 3px-wide indicator doesn't overflow the wrapper
    const maxLeft = wrapperRect.width - 3;
    indicatorLeftPx = Math.max(0, Math.min(indicatorLeftPx, maxLeft));

    this._dropIndicatorState.set({
      leftPx: indicatorLeftPx,
      heightPx: indicatorHeight,
    });
  }

  public endColumnReorder(cancel: boolean): void {
    if (!this.reorderable()) return;

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

          this.columnOrder.set(effectiveOrder);
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
    if (!this.resizable()) return;

    const cells = this._registeredHeaderCells();
    const headerCell = cells[columnIndex];
    if (!headerCell) return;

    const tableEl = this.element.nativeElement.querySelector('table');
    if (!tableEl) return;

    const headerEl = headerCell.element.nativeElement as HTMLElement;
    const ctx = autoSizeCanvasCtx();

    let maxContentWidth = 0;

    // Measure header: text width + non-text siblings (icons, controls) + flex gap.
    // The header cell is a flex container with: cell-text, spacer, filter/sort icons, resize handle.
    const cellTextClass = this.theme.class('cell-text');
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
    maxContentWidth = headerRequiredWidth;

    // Measure visible body cells (nth-child is 1-indexed)
    const bodyCells = Array.from(
      tableEl.querySelectorAll<HTMLElement>(`tbody tr td:nth-child(${columnIndex + 1})`)
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
