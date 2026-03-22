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
import { ResizeEngine, type ResizableItem } from '@ngneers/controls/api/resize';
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
        return this._resizeEngine.gridTemplateSizes();
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
}
