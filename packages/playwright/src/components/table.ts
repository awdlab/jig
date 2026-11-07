import { expect, type Locator } from '@playwright/test';
import { tableControlTemplate } from '@awdlab/jig-themes/templates/table';
import { themeClasses } from '../utils/theme.js';
import { JigHarness } from '../harness.js';
import { JigCheckboxHarness } from './checkbox.js';
import { JigFilterFieldHarness } from './filter-field.js';
import { JigPaginatorHarness } from './paginator.js';
import { JigScrollerHarness } from './scroller.js';

export type JigTableSort = 'ascending' | 'descending' | 'none';

export class JigTableHarness extends JigHarness {
  public readonly classes = themeClasses(tableControlTemplate);

  /** The `role="grid"` element: the single tab stop, and the keyboard target for row nav. */
  public readonly grid: Locator;
  public readonly headerCells: Locator;
  /** Body rows, excluding group headers, skeletons and the error row. */
  public readonly rows: Locator;
  public readonly cells: Locator;
  public readonly selectedRows: Locator;
  public readonly groupHeaders: Locator;
  public readonly resizeHandles: Locator;
  public readonly dropIndicator: Locator;
  public readonly skeletonRows: Locator;
  public readonly errorRow: Locator;
  public readonly rowActionsBar: Locator;
  public readonly scroller: JigScrollerHarness;
  public readonly paginator: JigPaginatorHarness;

  constructor(locator: Locator) {
    super(locator);
    this.grid = locator.locator('table[role="grid"]');
    this.headerCells = locator.locator('thead th');
    this.rows = locator.locator(`tbody tr[role="row"]${this.notRowKind()}`);
    // Header cells carry the `cell` class too, so data cells are scoped to the body.
    this.cells = locator.locator(`tbody ${this.classes.cell}`);
    this.selectedRows = locator.locator(this.classes['selected-row']);
    this.groupHeaders = locator.locator(this.classes['group-header-row']);
    this.resizeHandles = locator.locator(this.classes['resize-handle']);
    this.dropIndicator = locator.locator(this.classes['drop-indicator']);
    this.skeletonRows = locator.locator(this.classes['skeleton-row']);
    this.errorRow = locator.locator(this.classes['error-row']);
    this.rowActionsBar = locator.locator('jig-table-row-actions-bar');
    this.scroller = new JigScrollerHarness(locator.locator('tbody'));
    this.paginator = new JigPaginatorHarness(locator.locator('jig-paginator'));
  }

  public getRowByIndex(index: number): Locator {
    return this.rows.nth(index);
  }

  /** A data cell by row and column index. */
  public getCellByIndex(row: number, column: number): Locator {
    return this.getRowByIndex(row).locator(this.classes.cell).nth(column);
  }

  /** Every data cell of one row, in column order. */
  public getRowCellsByIndex(row: number): Locator {
    return this.getRowByIndex(row).locator(this.classes.cell);
  }

  public getHeaderCellByIndex(column: number): Locator {
    return this.headerCells.nth(column);
  }

  public expectRowCount(count: number): Promise<void> {
    return expect(this.rows).toHaveCount(count);
  }

  /** Asserts the visible text of every data cell of a row, in column order. */
  public expectRowTexts(index: number, texts: string[]): Promise<void> {
    return expect(this.getRowByIndex(index).locator(this.classes.cell)).toHaveText(texts);
  }

  public expectSelected(index: number, selected = true): Promise<void> {
    return expect(this.getRowByIndex(index)).toHaveAttribute('aria-selected', String(selected));
  }

  /** Asserts a row state class such as `focused-row` or `active-row`. */
  public expectRowClass(
    index: number,
    className: 'focused-row' | 'active-row' | 'selected-row',
    present = true
  ): Promise<void> {
    const row = expect(this.getRowByIndex(index));
    const name = this.classes[className].slice(1);
    return present ? row.toContainClass(name) : row.not.toContainClass(name);
  }

  public expectSelectedCount(count: number): Promise<void> {
    return expect(this.selectedRows).toHaveCount(count);
  }

  /** Asserts the row the grid's `aria-activedescendant` points at. */
  public async expectFocusedRow(index: number): Promise<void> {
    const id = await this.getRowByIndex(index).getAttribute('id');
    await expect(this.grid).toHaveAttribute('aria-activedescendant', id ?? '');
  }

  /** Keyboard row navigation goes through the grid, never through a row. */
  public async pressGrid(key: string): Promise<void> {
    await this.grid.focus();
    await this.grid.press(key);
  }

  // --- selection -----------------------------------------------------------

  /** The header checkbox that selects every row. */
  public get selectAll(): JigCheckboxHarness {
    return new JigCheckboxHarness(
      this.locator.locator(`thead ${this.classes['selection-checkbox']}`)
    );
  }

  public getRowCheckboxByIndex(index: number): JigCheckboxHarness {
    return new JigCheckboxHarness(
      this.getRowByIndex(index).locator(this.classes['selection-checkbox'])
    );
  }

  // --- sorting / filtering -------------------------------------------------

  public getSortControlByIndex(column: number): Locator {
    return this.getHeaderCellByIndex(column).locator(this.classes['sort-control']);
  }

  public sortBy(column: number): Promise<void> {
    return this.getHeaderCellByIndex(column).click();
  }

  public expectSort(column: number, sort: JigTableSort): Promise<void> {
    return expect(this.getHeaderCellByIndex(column)).toHaveAttribute('aria-sort', sort);
  }

  /** The filter popover of a `jigTableFilterableColumn` header. */
  public getColumnFilterByIndex(column: number): JigFilterFieldHarness {
    return new JigFilterFieldHarness(this.getHeaderCellByIndex(column).locator('jig-filter-field'));
  }

  // --- column resize / reorder --------------------------------------------

  /** Drag a column's resize handle by `delta` pixels. */
  public async resizeColumn(column: number, delta: number): Promise<void> {
    const handle = this.resizeHandles.nth(column);
    const box = await handle.boundingBox();
    if (!box) throw new Error(`column ${column} has no resize handle`);
    const y = box.y + box.height / 2;
    await this.page.mouse.move(box.x + box.width / 2, y);
    await this.page.mouse.down();
    await this.page.mouse.move(box.x + box.width / 2 + delta, y, { steps: 5 });
    await this.page.mouse.up();
  }

  public async columnWidth(column: number): Promise<number> {
    const box = await this.getHeaderCellByIndex(column).boundingBox();
    if (!box) throw new Error(`column ${column} has no box`);
    return box.width;
  }

  /** Drag a header onto another header's position — the column reorder path. */
  public async reorderColumn(from: number, to: number): Promise<void> {
    const source = await this.getHeaderCellByIndex(from).boundingBox();
    const target = await this.getHeaderCellByIndex(to).boundingBox();
    if (!source || !target) throw new Error('header has no box');
    await this.page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, {
      steps: 10,
    });
    await this.page.mouse.up();
  }

  public expectColumnTexts(texts: string[]): Promise<void> {
    return expect(this.headerCells).toHaveText(texts);
  }

  // --- grouping ------------------------------------------------------------

  public getGroupHeaderByIndex(index: number): Locator {
    return this.groupHeaders.nth(index);
  }

  public expectGroupCount(count: number): Promise<void> {
    return expect(this.groupHeaders).toHaveCount(count);
  }

  public toggleGroup(index: number): Promise<void> {
    return this.getGroupHeaderByIndex(index).click();
  }

  /** `aria-expanded` sits on the group header's cell, not on its row. */
  public expectGroupExpanded(index: number, expanded = true): Promise<void> {
    return expect(
      this.getGroupHeaderByIndex(index).locator(this.classes['group-header-cell'])
    ).toHaveAttribute('aria-expanded', String(expanded));
  }

  // --- row actions ---------------------------------------------------------

  public getRowActionByIndex(index: number, testId: string): Locator {
    return this.getRowByIndex(index).locator(`[data-testid="${testId}"]`);
  }

  public getRowActionsBarByIndex(index: number): Locator {
    return this.getRowByIndex(index).locator('jig-table-row-actions-bar');
  }

  public expectRowActionsBarVisible(visible = true): Promise<void> {
    return expect(this.rowActionsBar).toHaveCount(visible ? 1 : 0);
  }

  // --- load state ----------------------------------------------------------

  public expectLoading(loading = true): Promise<void> {
    return loading
      ? expect(this.grid).toHaveAttribute('aria-busy', 'true')
      : expect(this.grid).not.toHaveAttribute('aria-busy', 'true');
  }

  public expectError(error = true): Promise<void> {
    return expect(this.errorRow).toHaveCount(error ? 1 : 0);
  }

  /** Rows the harness never counts as data: group headers, skeletons, the error row. */
  private notRowKind(): string {
    return [
      this.classes['group-header-row'],
      this.classes['skeleton-row'],
      this.classes['error-row'],
    ]
      .map(cls => `:not(${cls})`)
      .join('');
  }
}
