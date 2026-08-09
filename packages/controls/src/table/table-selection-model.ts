import { computed, signal } from '@angular/core';

import type { FormattedTableDataRow, FormattedTableRow, TableSelectionMode } from './types';
import type { ModelSignal, Signal, WritableSignal } from '@angular/core';

export interface TableSelectionModelDeps<T extends object, K extends keyof T> {
  viewRows: Signal<readonly FormattedTableRow<T>[]>;
  selectionMode: Signal<TableSelectionMode | null>;
  fieldId: Signal<K>;
  /** The table's public two-way `selection` model, by reference. */
  selection: ModelSignal<T[K & keyof T][]>;
  /** The table's public `focusedRowIndex` signal, by reference. */
  focusedRowIndex: WritableSignal<number | null>;
  /** Scrolls the row at the given index into view (delegates to the table's AwdScroller). */
  scrollToIndex: (index: number) => void;
}

/**
 * Owns row selection, the selection anchor, keyboard navigation, and the derived
 * select-all / indeterminate state for {@link AwdTable}. Reads the view rows through an
 * injected signal and writes only the selection + focus state passed in.
 */
export class TableSelectionModel<T extends object, K extends keyof T> {
  constructor(private readonly _deps: TableSelectionModelDeps<T, K>) {}

  /** Anchor index for Shift+click range selection (index in viewRows). */
  private readonly _selectionAnchor = signal<number | null>(null);

  public readonly selectionSet = computed(() => new Set(this._deps.selection()), {
    equal: (a, b) => a.size === b.size && [...a].every(v => b.has(v)),
  });

  public readonly isAllSelected = computed(() => {
    const rows = this._deps.viewRows();
    const selSet = this.selectionSet();
    return rows.length > 0 && rows.every(row => selSet.has(row.id as T[K & keyof T]));
  });

  public readonly isIndeterminate = computed(() => {
    const selSet = this.selectionSet();
    return selSet.size > 0 && !this.isAllSelected();
  });

  public readonly headerCheckboxValue = computed<boolean | null>(() => {
    if (this.isAllSelected()) return true;
    if (this.isIndeterminate()) return null;
    return false;
  });

  public isRowSelected(id: T[keyof T] & (string | number)): boolean {
    return this.selectionSet().has(id as T[K & keyof T]);
  }

  public handleRowClick(row: FormattedTableDataRow<T>, event: MouseEvent): void {
    const mode = this._deps.selectionMode();
    if (!mode) return;

    const id = row.id as T[K & keyof T];
    const rowIndex = this._deps.viewRows().findIndex(r => r.id === row.id);

    if (mode === 'single') {
      this._deps.selection.set([id]);
      this._selectionAnchor.set(rowIndex);
      this._deps.focusedRowIndex.set(null);
      return;
    }

    if (event.shiftKey && this._selectionAnchor() !== null) {
      this._selectRange(this._selectionAnchor()!, rowIndex);
    } else if (event.ctrlKey || event.metaKey) {
      this._toggleRowInSelection(id);
    } else {
      this._toggleRowInSelection(id);
    }
    this._selectionAnchor.set(rowIndex);
    this._deps.focusedRowIndex.set(null);
  }

  public handleCheckboxChange(row: FormattedTableDataRow<T>): void {
    const id = row.id as T[K & keyof T];
    this._toggleRowInSelection(id);
    const rowIndex = this._deps.viewRows().findIndex(r => r.id === row.id);
    this._selectionAnchor.set(rowIndex);
    this._deps.focusedRowIndex.set(null);
  }

  public toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this._deps.selection.set([]);
    } else {
      const dataRows = this._deps
        .viewRows()
        .filter((r): r is FormattedTableDataRow<T> => r.kind === 'data');
      this._deps.selection.set(dataRows.map(r => r.id as T[K & keyof T]));
    }
  }

  private _toggleRowInSelection(id: T[K & keyof T]): void {
    const current = this._deps.selection();
    if (this.selectionSet().has(id)) {
      this._deps.selection.set(current.filter(v => v !== id));
    } else {
      this._deps.selection.set([...current, id]);
    }
  }

  private _selectRange(fromIndex: number, toIndex: number): void {
    const rows = this._deps.viewRows();
    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);
    const rangeIds = rows
      .slice(start, end + 1)
      .filter((r): r is FormattedTableDataRow<T> => r.kind === 'data')
      .map(r => r.id as T[K & keyof T]);

    const currentSet = new Set(this._deps.selection());
    for (const id of rangeIds) {
      currentSet.add(id);
    }
    this._deps.selection.set([...currentSet]);
  }

  /**
   * The index row navigation should move from: the current row when set,
   * otherwise the last clicked/selected row (the anchor), otherwise `-1` so
   * the first ArrowDown lands on row 0.
   */
  public resolveCurrentIndex(): number {
    const focused = this._deps.focusedRowIndex();
    if (focused !== null) return focused;
    const anchor = this._selectionAnchor();
    if (anchor !== null) return anchor;
    const sel = this._deps.selection();
    if (this._deps.selectionMode() === 'single' && sel.length > 0) {
      return this._deps.viewRows().findIndex(r => r.id === sel[0]);
    }
    return -1;
  }

  /**
   * Moves the current row to `index`, scrolls it into view and applies the
   * selection side-effects for the active mode. The single mover for every
   * row-navigation key — {@link TableRowNavigationModel} calls it rather than
   * recomputing the move itself.
   */
  public moveTo(index: number, shiftKey = false): void {
    this._deps.focusedRowIndex.set(index);
    this._deps.scrollToIndex(index);
    this.applyArrowMove(index, shiftKey);
  }

  public onKeyDown(event: KeyboardEvent): void {
    const mode = this._deps.selectionMode();
    if (!mode) return;
    if (event.key !== ' ' && event.key !== 'Enter') return;

    const rows = this._deps.viewRows();
    const focusIdx = this._deps.focusedRowIndex();
    if (focusIdx === null || !rows[focusIdx]) return;
    event.preventDefault();
    event.stopPropagation();
    if (mode === 'single') {
      this.selectCurrentRow(focusIdx);
    } else {
      this.toggleCurrentRow(focusIdx);
    }
  }

  /**
   * Applies the selection side-effects of a row move that already set
   * `focusedRowIndex` to `nextIndex` — single mode selects the row and resets
   * the anchor, multi mode with `shiftKey` extends the range from the anchor,
   * multi mode alone only moves focus. No-ops without a selection mode.
   */
  private applyArrowMove(nextIndex: number, shiftKey: boolean): void {
    const mode = this._deps.selectionMode();
    if (!mode) return;
    const rows = this._deps.viewRows();
    const row = rows[nextIndex];
    if (!row || row.kind === 'group-header') return;

    if (mode === 'single') {
      this._deps.selection.set([row.id as T[K & keyof T]]);
      this._selectionAnchor.set(nextIndex);
    } else if (shiftKey) {
      const anchor = this._selectionAnchor() ?? nextIndex;
      this._selectRange(anchor, nextIndex);
    }
  }

  /** Toggles selection of the row at `index` and makes it the new anchor (multi-mode Enter/Space). */
  public toggleCurrentRow(index: number): void {
    const row = this._deps.viewRows()[index];
    if (!row || row.kind === 'group-header') return;
    this._toggleRowInSelection(row.id as T[K & keyof T]);
    this._selectionAnchor.set(index);
  }

  /** Makes the row at `index` the sole selection (single-mode Enter/Space). */
  public selectCurrentRow(index: number): void {
    const row = this._deps.viewRows()[index];
    if (!row || row.kind === 'group-header') return;
    this._deps.selection.set([row.id as T[K & keyof T]]);
    this._selectionAnchor.set(index);
  }
}
