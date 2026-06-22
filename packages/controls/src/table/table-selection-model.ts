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
  /** Scrolls the row at the given index into view (delegates to the table's NgnScroller). */
  scrollToIndex: (index: number) => void;
}

/**
 * Owns row selection, the selection anchor, keyboard navigation, and the derived
 * select-all / indeterminate state for {@link NgnTable}. Reads the view rows through an
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

  public onKeyDown(event: KeyboardEvent): void {
    const mode = this._deps.selectionMode();
    if (!mode) return;

    const rows = this._deps.viewRows();
    if (rows.length === 0) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();

      let currentIndex = this._deps.focusedRowIndex();
      if (currentIndex === null && mode === 'single') {
        const sel = this._deps.selection();
        if (sel.length > 0) {
          currentIndex = rows.findIndex(r => r.id === sel[0]);
        }
      }
      currentIndex ??= -1;

      const nextIndex =
        event.key === 'ArrowDown'
          ? Math.min(currentIndex + 1, rows.length - 1)
          : Math.max(currentIndex - 1, 0);

      this._deps.focusedRowIndex.set(nextIndex);
      this._deps.scrollToIndex(nextIndex);

      if (mode === 'single') {
        const id = rows[nextIndex]!.id as T[K & keyof T];
        this._deps.selection.set([id]);
        this._selectionAnchor.set(nextIndex);
      } else if (event.shiftKey) {
        const anchor = this._selectionAnchor() ?? nextIndex;
        this._selectRange(anchor, nextIndex);
      }
    } else if (event.key === ' ' || event.key === 'Enter') {
      if (mode === 'multi') {
        const focusIdx = this._deps.focusedRowIndex();
        if (focusIdx !== null && rows[focusIdx]) {
          event.preventDefault();
          event.stopPropagation();
          const id = rows[focusIdx]!.id as T[K & keyof T];
          this._toggleRowInSelection(id);
          this._selectionAnchor.set(focusIdx);
        }
      }
    }
  }
}
