import { signal } from '@angular/core';

import type { FormattedTableRow, TableSelectionMode } from './types';
import type { Signal, WritableSignal } from '@angular/core';

export interface RowNavigationDeps<T extends object> {
  /** The currently rendered/formatted rows, in view order. */
  viewRows: Signal<readonly FormattedTableRow<T>[]>;
  /**
   * Whether any row currently has a registered row-actions directive. Gates
   * the whole model — when `false` the model consumes nothing, so tables
   * without row actions keep byte-for-byte selection keyboard behavior.
   */
  hasActions: () => boolean;
  /**
   * The table's single current-row index, shared with (and driven by)
   * {@link import('./table-selection-model').TableSelectionModel}. This model
   * reads and writes it directly instead of owning a separate index, so
   * row-actions navigation and selection navigation always agree on which
   * row is current.
   */
  focusedRowIndex: WritableSignal<number | null>;
  /** The table's active selection mode, or `null` when selection is disabled. */
  selectionMode: Signal<TableSelectionMode | null>;
  /** Scrolls the row at `index` into view (used when the current row moves). */
  scrollToIndex: (index: number) => void;
  /** Enter the current row's action bar; returns true if a bar exists + focus moved in. */
  enterActions: (rowIndex: number) => boolean;
  /** Move within the bar; returns true while focus stays in the bar. */
  moveAction: (rowIndex: number, delta: 1 | -1) => boolean;
  /** Open the context menu for the current row (keyboard trigger). */
  openMenu: (rowIndex: number) => boolean;
  /** Returns DOM focus to the table's own tab stop when leaving the action bar. */
  focusHost: () => void;
}

/**
 * Roving keyboard model for row actions, reconciled onto the table's single
 * current-row index ({@link RowNavigationDeps.focusedRowIndex}). The single
 * tab stop lives on the table host; ArrowRight enters the action bar and
 * ArrowLeft/Right move between actions, ArrowLeft off the first action
 * returns to row navigation. ContextMenu and Shift+F10 always open the
 * context menu on the current row, regardless of selection mode.
 *
 * When {@link RowNavigationDeps.selectionMode} is set and focus is not in
 * the action bar, this model deliberately does **not** handle
 * ArrowUp/Down/Enter/Space itself — it returns `false` so the table's own
 * `onKeyDown` falls through to
 * {@link import('./table-selection-model').TableSelectionModel#onKeyDown},
 * which already resolves the start row correctly (including the
 * null-`focusedRowIndex` → currently-selected-row fallback after a mouse
 * click). Recomputing that start index here would silently diverge from the
 * selection model's resolution — that's exactly the bug this delegation
 * avoids. When `selectionMode` is `null`, this model owns ArrowUp/Down
 * itself (moves `focusedRowIndex`) and Enter opens the context menu. Only
 * claims keys when at least one row has registered actions (see
 * {@link RowNavigationDeps.hasActions}), so tables without row actions keep
 * selection's keyboard behavior untouched.
 */
export class TableRowNavigationModel<T extends object> {
  /** Whether DOM focus is currently inside the current row's action bar (as opposed to on the row itself). */
  public readonly inActions = signal(false);

  constructor(private readonly _deps: RowNavigationDeps<T>) {}

  /** Returns true when the event was handled (caller should stop propagation to other handlers). */
  public onKeyDown(event: KeyboardEvent): boolean {
    if (!this._deps.hasActions()) return false;

    const rows = this._deps.viewRows();
    if (rows.length === 0) return false;
    const current = this._deps.focusedRowIndex();
    const mode = this._deps.selectionMode();

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        return this._moveRow(event, rows.length, current, mode);
      case 'ArrowRight':
        return this._moveRight(event, current);
      case 'ArrowLeft':
        return this._moveLeft(event, current);
      case 'Enter':
      case ' ':
        return this._activate(event, current, mode);
      case 'ContextMenu':
        return this._openMenu(event, current);
      case 'F10':
        return event.shiftKey ? this._openMenu(event, current) : false;
      case 'Escape':
        // Back out of the action bar to the row (standard roving-toolbar exit),
        // mirroring ArrowLeft off the first action.
        if (!this.inActions()) return false;
        this.inActions.set(false);
        this._deps.focusHost();
        event.preventDefault();
        return true;
      default:
        return false;
    }
  }

  private _moveRow(
    event: KeyboardEvent,
    rowCount: number,
    current: number | null,
    mode: TableSelectionMode | null
  ): boolean {
    // While focus is inside the action bar, ArrowUp/Down must not move the
    // current row (and must not fall through to selection) — swallow them.
    if (this.inActions()) {
      event.preventDefault();
      return true;
    }
    if (mode) {
      // Delegate entirely to TableSelectionModel.onKeyDown — it already
      // resolves the start index (including the null-focus → selected-row
      // fallback) and applies the move/select/scroll side-effects. Returning
      // `false` here lets the table's onKeyDown fall through to it, so the
      // combined single/multi-select + actions behavior stays byte-identical
      // to the no-actions case.
      return false;
    }
    const start = current ?? -1;
    const next =
      event.key === 'ArrowDown' ? Math.min(start + 1, rowCount - 1) : Math.max(start - 1, 0);
    this._deps.focusedRowIndex.set(next);
    this._deps.scrollToIndex(next);
    event.preventDefault();
    return true;
  }

  private _moveRight(event: KeyboardEvent, current: number | null): boolean {
    if (current === null) return false;
    if (this.inActions()) {
      this._deps.moveAction(current, 1);
      event.preventDefault();
      return true;
    }
    if (!this._deps.enterActions(current)) return false;
    this.inActions.set(true);
    event.preventDefault();
    return true;
  }

  private _moveLeft(event: KeyboardEvent, current: number | null): boolean {
    if (current === null || !this.inActions()) return false;
    const stayed = this._deps.moveAction(current, -1);
    if (!stayed) {
      this.inActions.set(false); // fell off the first action → back to row navigation
      this._deps.focusHost();
    }
    event.preventDefault();
    return true;
  }

  private _activate(
    event: KeyboardEvent,
    current: number | null,
    mode: TableSelectionMode | null
  ): boolean {
    // Let the focused native <button> handle Enter/Space itself — do not
    // preventDefault, do not open the menu.
    if (this.inActions()) return false;
    // Delegate entirely to TableSelectionModel.onKeyDown when selection is
    // active — same rationale as the ArrowUp/Down case in `_moveRow`: it
    // reads the same `focusedRowIndex`, but keeping a single handler avoids
    // this model silently drifting from the selection model's semantics.
    if (mode) return false;
    if (current === null) return false;
    if (event.key !== 'Enter') return false; // Space is a no-op without selection
    return this._openMenu(event, current);
  }

  private _openMenu(event: KeyboardEvent, current: number | null): boolean {
    if (current === null || this.inActions()) return false;
    if (!this._deps.openMenu(current)) return false;
    event.preventDefault();
    return true;
  }
}
