import { signal } from '@angular/core';

import type { FormattedTableRow, TableSelectionMode } from './types';
import type { Signal, WritableSignal } from '@angular/core';
import { inlineArrowStep } from '@awdlab/jig/api/ng';

export interface RowNavigationDeps<T extends object> {
  /** The currently rendered/formatted rows, in view order. */
  viewRows: Signal<readonly FormattedTableRow<T>[]>;
  /** Whether any row currently has a registered row-actions directive. Gates the action-bar keys only. */
  hasActions: () => boolean;
  /** The table's single current-row index, shared with the selection model. */
  focusedRowIndex: WritableSignal<number | null>;
  /** The table's active selection mode, or `null` when selection is disabled. */
  selectionMode: Signal<TableSelectionMode | null>;
  /** The index a move starts from, resolved by the selection model. */
  resolveCurrentIndex: () => number;
  /** Moves the current row to `index`, scrolls it into view and applies selection side-effects. */
  moveTo: (index: number, shiftKey: boolean) => void;
  /** Toggles the row at `index` when it is a group header; returns whether it was one. */
  toggleGroup: (index: number) => boolean;
  /** Enter the current row's action bar; returns true if a bar exists + focus moved in. */
  enterActions: (rowIndex: number) => boolean;
  /** Move within the bar; returns true while focus stays in the bar. */
  moveAction: (rowIndex: number, delta: 1 | -1) => boolean;
  /** Open the context menu for the current row (keyboard trigger). */
  openMenu: (rowIndex: number) => boolean;
  /** Returns DOM focus to the table's own tab stop when leaving the action bar. */
  focusHost: () => void;
}

/** Rows moved per PageUp/PageDown. */
const PAGE_STEP = 10;

/**
 * Keyboard model for the grid's single tab stop. Owns row movement in every
 * mode (ArrowUp/Down, Home/End, PageUp/PageDown) by delegating the move to
 * {@link RowNavigationDeps.moveTo}, so selection follows the current row
 * without this model recomputing selection semantics. Enter/Space toggles a
 * group header, otherwise falls through to the selection model.
 *
 * The action-bar keys are gated on {@link RowNavigationDeps.hasActions}:
 * ArrowRight enters the current row's bar and ArrowLeft/Right move between
 * actions, ArrowLeft off the first action (or Escape) returns to row
 * navigation. ContextMenu and Shift+F10 open the current row's context menu.
 */
export class TableRowNavigationModel<T extends object> {
  /** Whether DOM focus is currently inside the current row's action bar (as opposed to on the row itself). */
  public readonly inActions = signal(false);

  constructor(private readonly _deps: RowNavigationDeps<T>) {}

  /** Returns true when the event was handled (caller should stop propagation to other handlers). */
  public onKeyDown(event: KeyboardEvent): boolean {
    const rows = this._deps.viewRows();
    if (rows.length === 0) return false;
    const current = this._deps.focusedRowIndex();
    const actions = this._deps.hasActions();

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Home':
      case 'End':
      case 'PageDown':
      case 'PageUp':
        return this._moveRow(event, rows.length);
      case 'ArrowRight':
      case 'ArrowLeft': {
        if (!actions) return false;
        // The action bar sits at the row's inline-end, so RTL reverses entry/exit.
        const step = inlineArrowStep(event.currentTarget as Element, event.key);
        return step === 1 ? this._moveRight(event, current) : this._moveLeft(event, current);
      }
      case 'Enter':
      case ' ':
        return this._activate(event, current, actions);
      case 'ContextMenu':
        return actions ? this._openMenu(event, current) : false;
      case 'F10':
        return actions && event.shiftKey ? this._openMenu(event, current) : false;
      case 'Escape':
        // Back out of the action bar to the row, mirroring ArrowLeft off the first action.
        if (!this.inActions()) return false;
        this.inActions.set(false);
        this._deps.focusHost();
        event.preventDefault();
        return true;
      default:
        return false;
    }
  }

  private _moveRow(event: KeyboardEvent, rowCount: number): boolean {
    // While focus is inside the action bar, row-movement keys must not move the
    // current row (and must not fall through to selection) — swallow them.
    if (this.inActions()) {
      event.preventDefault();
      return true;
    }
    const target = this._targetIndex(event.key, rowCount);
    if (target === null) return false;
    this._deps.moveTo(target, event.shiftKey);
    event.preventDefault();
    return true;
  }

  private _targetIndex(key: string, rowCount: number): number | null {
    const current = this._deps.resolveCurrentIndex();
    const last = rowCount - 1;
    switch (key) {
      case 'ArrowDown':
        return Math.min(current + 1, last);
      case 'ArrowUp':
        return Math.max(current - 1, 0);
      case 'Home':
        return 0;
      case 'End':
        return last;
      case 'PageDown':
        return Math.min(current + PAGE_STEP, last);
      case 'PageUp':
        return Math.max(current - PAGE_STEP, 0);
      default:
        return null;
    }
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

  private _activate(event: KeyboardEvent, current: number | null, actions: boolean): boolean {
    // Let the focused native <button> handle Enter/Space itself.
    if (this.inActions()) return false;
    if (current === null) return false;
    if (this._deps.toggleGroup(current)) {
      event.preventDefault();
      return true;
    }
    // Selection owns Enter/Space on data rows when a mode is active.
    if (this._deps.selectionMode()) return false;
    if (!actions) return false;
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
