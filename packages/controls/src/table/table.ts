import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  effect,
  type ElementRef,
  inject,
  input,
  model,
  signal,
  untracked,
  booleanAttribute,
  viewChild,
} from '@angular/core';
import { elementSizeSignal, JigTemplate } from '@awdlab/jig/api/ng';
import { JigPt, provideSelf } from '@awdlab/jig/base';
import { JigButton } from '@awdlab/jig/button';
import { I18n } from '@awdlab/jig/i18n';
import { JigIcon } from '@awdlab/jig/icon';
import { JigPaginator, type PaginationState } from '@awdlab/jig/paginator';
import { JigScrollShadow } from '@awdlab/jig/scroll-shadow';
import { JigScroller } from '@awdlab/jig/scroller';
import { JigSkeleton } from '@awdlab/jig/skeleton';
import { tableControlTemplate } from '@awdlab/jig-themes/templates/table';

import { TableColumnLayoutModel } from './table-column-layout-model';
import { JigTableGroupHeaderTr } from './table-group-header-row';
import { TableLazyModel } from './table-lazy-model';
import {
  filterRows,
  groupRows,
  paginateRows,
  sortRows,
  type TableSortComparator,
} from './table-row-model';
import { TableRowNavigationModel } from './table-row-navigation-model';
import { TableSelectionModel } from './table-selection-model';
import { JigTableTemplates } from './table-templates';

import type { JigTableTh } from './table-header-cell';
import type { JigTableRowActions } from './table-row-actions';
import type {
  FormattedTableDataRow,
  FormattedTableGroupHeaderRow,
  FormattedTableRow,
  TableDataSource,
  TableSelectionMode,
} from './types';
import type { JigFilterConfig } from '@awdlab/jig/filter';
import { JigError, type AllKeysOfUnion } from '@awdlab/jig/utils';
import { generateElementId } from '@awdlab/jig/utils-ng';

const DEFAULT_LAZY_PAGE_SIZE = 25;

/**
 * @category control
 */
@Component({
  selector: 'jig-table',
  templateUrl: './table.html',

  imports: [
    NgTemplateOutlet,
    JigScroller,
    JigPaginator,
    JigTemplate,
    JigPt,
    JigIcon,
    JigTableGroupHeaderTr,
    JigScrollShadow,
    JigButton,
    JigSkeleton,
  ],
  providers: [provideSelf(JigTable)],
  // Keydown is bound on the host so it also catches keys from the grid's tab stop.
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(focusin)': 'onFocusIn($event)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class JigTable<
  T extends object,
  K extends keyof T,
  G extends Extract<AllKeysOfUnion<T>, string> = never,
> extends JigTableTemplates<T> {
  protected readonly theme = this.injectThemeTemplate(tableControlTemplate, {
    root: true,
    virtual: () => this.virtual(),
    resizing: () => this._columns?.isDragging() ?? false,
    selectable: () => !!this.selectionMode(),
    reorderable: () => this.reorderable(),
    reordering: () => this._columns?.isReordering() ?? false,
    loading: () => this.loadStatus() === 'loading',
  });
  private readonly _scroller = viewChild.required(JigScroller);
  private readonly _grid = viewChild.required<ElementRef<HTMLElement>>('scrollContainer');
  private readonly _gridId = generateElementId();
  private readonly _head = viewChild<ElementRef<HTMLElement>>('head');
  /** Sticky header height — the band at the top of the grid that rows must stay clear of. */
  protected readonly headerHeight = computed(() => Math.ceil(this._headSize().height));
  private readonly _headSize = elementSizeSignal(this._head);

  /** The data rows to render in client-side mode. Ignored when {@link dataSource} is set. */
  public readonly rows = input<readonly T[]>([]);
  /**
   * Accessible name for the grid. Set this or {@link labelledBy} — a grid
   * without a name is announced unlabelled.
   * @default null
   */
  public readonly label = input<string | null>(null);
  /**
   * Id of an element that labels the grid (e.g. a heading above it).
   * Alternative to {@link label}.
   * @default null
   */
  public readonly labelledBy = input<string | null>(null);
  /**
   * When {@link virtual} is enabled, this defines the height of each row in pixels.
   */
  public readonly rowHeight = input<number>();
  /** The key of the property that uniquely identifies each row. */
  public readonly fieldId = input.required<K>();
  /**
   * Whether the table is virtualized. When enabled, provide {@link rowHeight}.
   * @default false
   */
  public readonly virtual = input<boolean>(false);
  /**
   * When {@link virtual} is enabled, the number of extra rows to render above and below the viewport.
   * @default 2
   */
  public readonly virtualPadding = input<number>(2);
  /**
   * Whether to apply alternating background colors to rows.
   * @default false
   */
  public readonly striped = input<boolean>(false);
  /**
   * Whether to render a paginator and page the rows.
   * @default false
   */
  public readonly paginator = input<boolean>(false);

  /**
   * A loader callback for server-driven lazy loading. When set, the table fetches
   * rows on demand instead of reading {@link rows}, and client-side sort/filter are
   * delegated to the loader. With {@link paginator} it pages lazily; without, it
   * infinite-scrolls. Incompatible with {@link groupBy} (throws).
   *
   * @remarks Bind to a stable reference (a class field/method), not an inline
   * arrow — a new function identity each change-detection cycle invalidates the
   * page cache and refetches every cycle.
   * @default null
   */
  public readonly dataSource = input<TableDataSource<T> | null>(null);
  /**
   * Infinite scroll only: set by the header select-all checkbox to request a
   * "select everything matching the current filters" bulk operation, since the
   * full set is not loaded. Two-way bindable.
   * @default false
   */
  public readonly selectAllMatching = model<boolean>(false);

  /**
   * The selection mode for the table.
   * - `'single'`: Only one row can be selected at a time.
   * - `'multi'`: Multiple rows can be selected (with Ctrl/Shift click or checkboxes).
   * - `null`: Selection is disabled.
   * @default null
   */
  public readonly selectionMode = input<TableSelectionMode | null>(null);

  /**
   * The selected row IDs. Two-way bindable via `[(selection)]`.
   * @default []
   */
  public readonly selection = model<T[K & keyof T][]>([]);

  /**
   * Column key to group rows by. Rows with the same value in this column
   * are collected under a collapsible group header.
   * @default null (no grouping)
   */
  public readonly groupBy = input<G | null>(null);

  /**
   * Two-way model tracking which groups are currently expanded, identified
   * by their column value. Defaults to `[]` (all collapsed).
   * Pass all group values to start with all groups expanded.
   *
   * Type-safe: when `groupBy` is set, this is typed as `T[G][]` where G
   * is the groupBy column key (inferred by Angular's template type checker).
   */
  public readonly expandedGroups = model<Array<T[G] & (string | number)>>([]);

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
  /**
   * The active sort descriptor (column + direction), or `null` when unsorted. Two-way bindable.
   * @default null
   */
  public readonly sort = model<{
    column: Extract<AllKeysOfUnion<T>, string>;
    direction: 'asc' | 'desc';
  } | null>(null);

  /**
   * Optional custom comparator used when `sort` is active. Receives the two rows and the
   * active sort descriptor. When omitted, a default comparator is used (nulls-first on asc,
   * numeric for numbers, `localeCompare` otherwise).
   */
  public readonly sortComparator = input<TableSortComparator<T> | undefined>(undefined);

  /**
   * The active per-column filter configuration, keyed by column, or `null` when unfiltered. Two-way bindable.
   * @default null
   */
  public readonly filters = model<
    | {
        [key in Extract<AllKeysOfUnion<T>, string>]?: JigFilterConfig;
      }
    | null
  >(null);
  protected readonly pageState = signal<PaginationState | null>(null);

  // --- Lazy (server-driven) loading ---

  protected readonly lazy = computed(() => !!this.dataSource());
  protected readonly lazyMode = computed<'paginate' | 'infinite'>(() =>
    this.paginator() ? 'paginate' : 'infinite'
  );

  private readonly _lazyModel = new TableLazyModel<T>({
    dataSource: this.dataSource,
    sort: this.sort,
    filters: computed(() => this.filters() as Record<string, JigFilterConfig> | null),
    mode: this.lazyMode,
  });

  protected readonly loadStatus = this._lazyModel.status;
  protected readonly loadError = this._lazyModel.error;
  protected readonly loadTotal = this._lazyModel.total;
  protected readonly lazyHasMore = this._lazyModel.hasMore;

  protected readonly i18n = inject(I18n).translations;
  /**
   * Polite live-region text announcing sort / filter / pagination / selection
   * changes to assistive tech. Populated by an effect in the constructor.
   */
  protected readonly liveAnnouncement = signal('');

  // --- Column layout (geometry, sticky, resize, reorder, auto-size) ---

  private readonly _columns: TableColumnLayoutModel = new TableColumnLayoutModel({
    element: this.element,
    resizable: this.resizable,
    reorderable: this.reorderable,
    resizeMode: this.resizeMode,
    lockSizes: this.lockSizes,
    columnOrder: this.columnOrder,
    themeClass: name => this.theme.class(name as Parameters<typeof this.theme.class>[0]),
  });

  /**
   * Whether a selection column directive is present in the template.
   * Set automatically by `JigTableSelectionColumn` — do not set manually.
   */
  public readonly showCheckboxes = this._columns.hasSelectionColumn;
  protected readonly dropIndicatorState = this._columns.dropIndicatorState;
  public readonly columnOrderMap = computed(() => this._columns.columnOrderMap());

  /**
   * Grid template columns computed from the resize engine when resizable,
   * otherwise falls back to the standard equal-width repeat.
   */
  public get gridTemplateColumns() {
    return this._columns.gridTemplateColumns;
  }

  // --- Selection state ---

  /**
   * The single current-row index (index in {@link formattedRows}) for
   * keyboard navigation. Shared by {@link JigTable}'s selection keyboard
   * handling and row-actions keyboard navigation — arrows move it, and (when
   * {@link selectionMode} is set) selection follows it. Cleared whenever
   * {@link formattedRows} changes identity (sort/filter/rows replaced) so it
   * never points at a stale row.
   */
  public readonly focusedRowIndex = signal<number | null>(null);

  private readonly _selection: TableSelectionModel<T, K>;

  public readonly headerCheckboxValue: ReturnType<typeof computed<boolean | null>>;

  // --- Row actions registry + keyboard navigation ---

  private readonly _rowActions = new Map<number, JigTableRowActions>();
  private readonly _rowNav: TableRowNavigationModel<T>;

  /**
   * Total column count including the selection checkbox column.
   */
  protected readonly totalColumnCount = computed(
    () => this._columns.columnCount() + (this._columns.hasSelectionColumn() ? 1 : 0)
  );

  /** `aria-rowcount` — includes the header row; `-1` when a lazy total is unknown. */
  protected readonly ariaRowCount = computed(() => {
    const total = this.lazy() ? this.loadTotal() : this.formattedRows().length;
    return total === undefined ? -1 : total + 1;
  });

  /** Identity of the current row, used to detect when the index goes stale. */
  private readonly _focusedRowId = computed(() => {
    const index = this.focusedRowIndex();
    return index === null ? null : (this.formattedRows()[index]?.id ?? null);
  });

  /** The DOM id of the current row, for `aria-activedescendant`. */
  protected readonly activeRowId = computed(() => {
    const index = this.focusedRowIndex();
    return index === null ? null : this.rowElementId(index);
  });

  /**
   * The DOM id of the row at `index`. Set on every row so the grid can point
   * `aria-activedescendant` at the current one.
   */
  public rowElementId(index: number): string {
    return `${this._gridId}_row_${index}`;
  }

  /** Number of placeholder rows to show while a lazy load is in flight. */
  protected readonly skeletonRows = computed(() => {
    if (this.loadStatus() !== 'loading') return 0;
    return this.paginator()
      ? (this.pageState()?.page.size ?? DEFAULT_LAZY_PAGE_SIZE)
      : this.virtualPadding() * 2 + 1;
  });

  protected readonly formattedRows = computed<FormattedTableRow<T>[]>(() => {
    const groupBy = this.groupBy();
    if (groupBy) {
      return this._groupedRows();
    }
    const rows = this._sortedRows();
    return rows.map((data, index) => ({
      kind: 'data' as const,
      id: data[this.fieldId()] as T[keyof T] & (string | number),
      data,
      index,
    }));
  });

  private readonly _groupedRows = computed<FormattedTableRow<T>[]>(() => {
    const groupBy = this.groupBy();
    if (!groupBy) return [];
    return groupRows(
      this._sortedRows(),
      groupBy,
      this.fieldId() as keyof T,
      new Set(this.expandedGroups())
    );
  });

  protected readonly pagedRows = computed<FormattedTableRow<T>[]>(() => {
    // Lazy pagination clears rows while fetching so skeletons replace the page.
    if (this.lazy() && this.lazyMode() === 'paginate' && this.loadStatus() === 'loading') {
      return [];
    }
    // Lazy loaders return exactly one page — never re-slice client-side.
    if (!this.paginator() || this.lazy()) {
      return this.formattedRows();
    }
    return [...paginateRows(this.formattedRows(), this.pageState())];
  });

  private readonly _baseRows = computed<readonly T[]>(() =>
    this.lazy() ? this._lazyModel.loaded() : this.rows()
  );

  private readonly _filteredRows = computed<readonly T[]>(() =>
    this.lazy() ? this._baseRows() : filterRows(this._baseRows(), this.filters())
  );

  /** Page size only — page navigation must not invalidate the per-page cache. */
  private readonly _lazyPageSize = computed(() => this.pageState()?.page.size);

  private readonly _sortedRows = computed<readonly T[]>(() =>
    this.lazy()
      ? this._baseRows()
      : sortRows(this._filteredRows(), this.sort(), this.sortComparator())
  );

  constructor() {
    super();

    this._selection = new TableSelectionModel<T, K>({
      viewRows: this.formattedRows,
      selectionMode: this.selectionMode,
      fieldId: this.fieldId,
      selection: this.selection,
      focusedRowIndex: this.focusedRowIndex,
      scrollToIndex: index => this._scroller().scrollToIndex(index),
    });

    this._rowNav = new TableRowNavigationModel<T>({
      viewRows: this.formattedRows,
      hasActions: () => this._rowActions.size > 0,
      focusedRowIndex: this.focusedRowIndex,
      selectionMode: this.selectionMode,
      resolveCurrentIndex: () => this._selection.resolveCurrentIndex(),
      moveTo: (index, shiftKey) => this._selection.moveTo(index, shiftKey),
      toggleGroup: index => {
        const row = this.formattedRows()[index];
        if (row?.kind !== 'group-header') return false;
        this.toggleGroupFromRow(row);
        return true;
      },
      enterActions: index => this.getRowActions(index)?.focusFirstAction() ?? false,
      moveAction: (index, delta) => this.getRowActions(index)?.moveAction(delta) ?? false,
      openMenu: index => this.getRowActions(index)?.openMenuFromKeyboard() ?? false,
      focusHost: () => this._grid().nativeElement.focus(),
    });

    this.headerCheckboxValue = computed<boolean | null>(() =>
      this.lazy() && this.lazyMode() === 'infinite'
        ? this.selectAllMatching()
        : this._selection.headerCheckboxValue()
    );

    // Drop the current-row highlight once a different row occupies that index
    // (sort/filter/rows replaced), but keep it when the same row is still there
    // — expanding a group must not lose the row the user is standing on.
    let previousRows: readonly FormattedTableRow<T>[] | null = null;
    let previousRowId: unknown = null;
    effect(() => {
      const rows = this.formattedRows();
      const rowId = this._focusedRowId();
      if (rows !== previousRows && previousRowId !== null && rowId !== previousRowId) {
        untracked(() => {
          this.focusedRowIndex.set(null);
          this._rowNav.inActions.set(false);
        });
      }
      previousRows = rows;
      previousRowId = rowId;
    });

    // A11y: announce sort / filter / pagination / selection changes through a
    // polite live region — none of these are otherwise conveyed to assistive
    // tech. Only the aspect that actually changed is announced (checked in
    // priority order), and the first run only seeds the baselines. Writes only
    // `liveAnnouncement`, which it never reads, so it cannot re-trigger itself.
    let seeded = false;
    let prevSort = '';
    let prevFilterCount = 0;
    let prevPageKey = '';
    let prevSelCount = 0;
    effect(() => {
      const sort = this.sort();
      // Lazy: announce the server total; fall back to the loaded window count.
      const filterCount = this.lazy()
        ? (this.loadTotal() ?? this._filteredRows().length)
        : this._filteredRows().length;
      const page = this.pageState();
      const selCount = this.selection().length;
      const selTotal = this.lazy() ? (this.loadTotal() ?? this.rows().length) : this.rows().length;

      const sortKey = sort ? `${sort.column}:${sort.direction}` : '';
      const pageKey = page ? `${page.page.current}/${page.page.size}` : '';

      if (!seeded) {
        seeded = true;
        [prevSort, prevFilterCount, prevPageKey, prevSelCount] = [
          sortKey,
          filterCount,
          pageKey,
          selCount,
        ];
        return;
      }

      let message = '';
      if (filterCount !== prevFilterCount) {
        message = this.i18n['table_resultCount']({ count: filterCount });
      } else if (sortKey !== prevSort) {
        message = sort
          ? this.i18n['table_sortedBy']({
              column: sort.column,
              direction:
                this.i18n[
                  sort.direction === 'asc' ? 'table_sortAscending' : 'table_sortDescending'
                ](),
            })
          : this.i18n['table_sortCleared']();
      } else if (pageKey !== prevPageKey) {
        const size = page?.page.size ?? 0;
        const pages = size > 0 ? Math.ceil(filterCount / size) : 1;
        message = this.i18n['table_page']({ page: (page?.page.current ?? 0) + 1, pages });
      } else if (selCount !== prevSelCount) {
        message = this.i18n['table_selectedCount']({ count: selCount, total: selTotal });
      }

      [prevSort, prevFilterCount, prevPageKey, prevSelCount] = [
        sortKey,
        filterCount,
        pageKey,
        selCount,
      ];
      if (message) {
        this.liveAnnouncement.set(message);
      }
    });

    // The error row carries no live semantics of its own — announce it here.
    effect(() => {
      if (this.loadStatus() === 'error') {
        this.liveAnnouncement.set(this.i18n['table_loadError']());
      }
    });

    // Lazy grouping needs the full row set, which lazy mode never has.
    effect(() => {
      if (this.lazy() && this.groupBy()) {
        throw new JigError('table', 'groupBy is not supported with a lazy dataSource (v1)');
      }
    });

    // Reset the lazy cache when sort, filter, page size or dataSource change.
    effect(() => {
      this.sort();
      this.filters();
      this._lazyPageSize();
      this.dataSource();
      if (!this.lazy()) return;
      untracked(() => this._lazyModel.invalidate());
    });

    // Lazy pagination: load the current page when it, sort, filters or dataSource change.
    effect(() => {
      const state = this.pageState();
      this.sort();
      this.filters();
      this.dataSource();
      if (!this.lazy() || this.lazyMode() !== 'paginate' || !state) return;
      untracked(() => void this._lazyModel.setPage(state));
    });

    // Infinite scroll: load the next window when the viewport nears the end.
    effect(() => {
      if (!this.lazy() || this.lazyMode() !== 'infinite') return;
      const distance = this._scroller().distanceFromEnd();
      const threshold = (this.rowHeight() ?? 40) * this.virtualPadding();
      const pageSize = this.pageState()?.page.size ?? DEFAULT_LAZY_PAGE_SIZE;
      if (distance <= threshold) {
        untracked(() => void this._lazyModel.loadNext(pageSize));
      }
    });
  }

  /** Force a lazy refetch, clearing the page cache. No-op in client-side mode. */
  public reload(): void {
    // Infinite scroll has no current page — restart from the first window.
    if (this.lazy() && this.lazyMode() === 'infinite') {
      this._lazyModel.invalidate();
      void this._lazyModel.loadNext(this.pageState()?.page.size ?? DEFAULT_LAZY_PAGE_SIZE);
      return;
    }
    void this._lazyModel.reload();
  }

  /** Retry the failed load, keeping already-loaded rows in infinite scroll. */
  protected retryLoad(): void {
    void this._lazyModel.retry();
  }

  protected pageChanged(event: PaginationState) {
    this.pageState.set(event);
  }

  public column<V extends AllKeysOfUnion<T> & string>(column: V): V {
    return column;
  }

  // --- Column registration / geometry (delegated to TableColumnLayoutModel) ---

  public getVisualColumnIndex(logicalIndex: number): number {
    return this._columns.getVisualColumnIndex(logicalIndex);
  }

  public getRegisteredHeaderCells(): readonly JigTableTh[] {
    return this._columns.getRegisteredHeaderCells();
  }

  public getStickyInfo(
    columnId: string
  ): { side: 'start' | 'end'; index: number; isEdge: boolean } | null {
    return this._columns.getStickyInfo(columnId);
  }

  public registerHeaderCell(cell: JigTableTh): void {
    this._columns.registerHeaderCell(cell);
  }

  public unregisterHeaderCell(cell: JigTableTh): void {
    this._columns.unregisterHeaderCell(cell);
  }

  public registerSelectionColumn(): void {
    this._columns.registerSelectionColumn();
  }

  public unregisterSelectionColumn(): void {
    this._columns.unregisterSelectionColumn();
  }

  public registerStickyColumn(columnId: string, side: 'start' | 'end'): void {
    this._columns.registerStickyColumn(columnId, side);
  }

  public unregisterStickyColumn(columnId: string): void {
    this._columns.unregisterStickyColumn(columnId);
  }

  // --- Resize operations (called by JigTableTh) ---

  public startColumnResize(columnIndex: number, event: PointerEvent): void {
    this._columns.startColumnResize(columnIndex, event);
  }

  public dragColumnResize(columnIndex: number, event: PointerEvent): void {
    this._columns.dragColumnResize(columnIndex, event);
  }

  public endColumnResize(columnIndex: number, cancel: boolean): void {
    this._columns.endColumnResize(columnIndex, cancel);
  }

  public autoSizeColumn(columnIndex: number): void {
    this._columns.autoSizeColumn(columnIndex);
  }

  // --- Reorder operations (called by JigTableReorderableColumn) ---

  public getReorderBounds(columnId: string): { min: number; max: number } {
    return this._columns.getReorderBounds(columnId);
  }

  public startColumnReorder(columnId: string): void {
    this._columns.startColumnReorder(columnId);
  }

  public dragColumnReorder(event: PointerEvent): void {
    this._columns.dragColumnReorder(event);
  }

  public endColumnReorder(cancel: boolean): void {
    this._columns.endColumnReorder(cancel);
  }

  public getReorderSourceColumnId(): string | null {
    return this._columns.getReorderSourceColumnId();
  }

  // --- Selection operations ---

  public isRowSelected(id: T[keyof T] & (string | number)): boolean {
    return this._selection.isRowSelected(id);
  }

  public handleRowClick(row: FormattedTableDataRow<T>, event: MouseEvent): void {
    this._selection.handleRowClick(row, event);
  }

  public handleCheckboxChange(row: FormattedTableDataRow<T>): void {
    this._selection.handleCheckboxChange(row);
  }

  public toggleSelectAll(): void {
    if (this.lazy() && this.lazyMode() === 'infinite') {
      this.selectAllMatching.update(v => !v);
      return;
    }
    this._selection.toggleSelectAll();
  }

  // --- Row actions registry ---

  /**
   * Registers a row's {@link JigTableRowActions} directive keyed by its row
   * index, so keyboard navigation can look up the active row's actions.
   * Called by `JigTableRowActions`; not intended for manual use.
   */
  public registerRowActions(index: number, dir: JigTableRowActions): void {
    this._rowActions.set(index, dir);
  }

  /**
   * Unregisters a row's actions directive. Called by `JigTableRowActions`.
   * Only removes the entry if `dir` is still the registered owner for
   * `index`, so a stale unregister (e.g. after row recycling re-registered
   * a different instance at the same index) cannot clobber it.
   */
  public unregisterRowActions(index: number, dir: JigTableRowActions): void {
    if (this._rowActions.get(index) === dir) this._rowActions.delete(index);
  }

  /** Looks up the registered actions directive for a row index, if any. */
  public getRowActions(index: number): JigTableRowActions | undefined {
    return this._rowActions.get(index);
  }

  /**
   * Whether keyboard focus is currently inside the action bar of the row at
   * `index` — i.e. this row is both the current row and
   * {@link TableRowNavigationModel.inActions}. Drives the `active-row`
   * highlight in {@link JigTableBodyTr}.
   */
  public isRowInActions(index: number): boolean {
    return this._rowNav.inActions() && this.focusedRowIndex() === index;
  }

  // --- Keyboard navigation ---

  /**
   * Keeps the "focus is in a row's action bar" state tied to where focus
   * actually is. Without this, tabbing out of a bar leaves the flag set and
   * the arrow keys stay swallowed for good.
   */
  protected onFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement | null;
    const bar = target?.closest('jig-table-row-actions-bar') ?? null;
    this._rowNav.inActions.set(!!bar);
    if (!bar) return;
    // Tabbing straight into a bar makes its row the current one, so leaving the
    // bar again returns to a row the user can navigate from.
    const rowIndex = bar.closest('tr')?.getAttribute('aria-rowindex');
    if (rowIndex) this.focusedRowIndex.set(Number(rowIndex) - 2);
  }

  /** Focus left the table entirely — the action bar is no longer where focus is. */
  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.element.nativeElement.contains(next)) return;
    this._rowNav.inActions.set(false);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    // Only keys from the grid's tab stop and the body's roving action bar drive row
    // navigation — header controls (sort, filter popover) and the paginator keep theirs.
    const target = event.target as HTMLElement | null;
    if (!target || !this._grid().nativeElement.contains(target) || target.closest('thead')) return;
    if (this._rowNav.onKeyDown(event)) return;
    if (this._rowNav.inActions()) return; // focus is in a row's action bar — selection must not handle keys
    this._selection.onKeyDown(event);
  }

  // --- Row grouping ---

  /**
   * Toggle the expanded state of a group identified by its column value.
   */
  public toggleGroup(groupKey: T[G] & (string | number)): void {
    const current = this.expandedGroups();
    if (current.includes(groupKey)) {
      this.expandedGroups.set(current.filter(k => k !== groupKey));
    } else {
      this.expandedGroups.set([...current, groupKey]);
    }
  }

  /**
   * Toggle a group from a group-header row. Used in the template where
   * the scroller item type cannot carry the `G` generic.
   * @internal
   */
  protected toggleGroupFromRow(row: FormattedTableGroupHeaderRow): void {
    this.toggleGroup(row.groupKey as T[G] & (string | number));
  }
}
