import { Component, model, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TableSelectionModel } from './table-selection-model';

import type { FormattedTableRow, TableSelectionMode } from './types';

type Row = { id: number; name: string };

function dataRows(ids: number[]): FormattedTableRow<Row>[] {
  return ids.map((id, index) => ({ kind: 'data', id, data: { id, name: `r${id}` }, index }));
}

@Component({
  selector: 'test-harness',
  standalone: true,
  template: '',
})
class TestHarnessComponent {
  selection = model<number[]>([]);

  make(mode: TableSelectionMode, ids = [1, 2, 3, 4]) {
    const viewRows = signal<readonly FormattedTableRow<Row>[]>(dataRows(ids));
    const focusedRowIndex = signal<number | null>(null);
    const scrollToIndex = vi.fn<(i: number) => void>();
    const m = new TableSelectionModel<Row, 'id'>({
      viewRows,
      selectionMode: signal<TableSelectionMode | null>(mode),
      fieldId: signal('id'),
      selection: this.selection,
      focusedRowIndex,
      scrollToIndex,
    });
    return { m, viewRows, focusedRowIndex, scrollToIndex };
  }
}

describe('TableSelectionModel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHarnessComponent],
    });
  });

  it('single mode selects exactly one row on click', () => {
    TestBed.runInInjectionContext(() => {
      const harness = new TestHarnessComponent();
      const { m } = harness.make('single');
      m.handleRowClick(
        { kind: 'data', id: 2, data: { id: 2, name: 'r2' }, index: 1 },
        {} as MouseEvent
      );
      expect(harness.selection()).toEqual([2]);
      m.handleRowClick(
        { kind: 'data', id: 3, data: { id: 3, name: 'r3' }, index: 2 },
        {} as MouseEvent
      );
      expect(harness.selection()).toEqual([3]);
    });
  });

  it('multi mode ctrl-click toggles membership', () => {
    TestBed.runInInjectionContext(() => {
      const harness = new TestHarnessComponent();
      const { m } = harness.make('multi');
      const ev = { ctrlKey: true } as MouseEvent;
      m.handleRowClick({ kind: 'data', id: 1, data: { id: 1, name: 'r1' }, index: 0 }, ev);
      m.handleRowClick({ kind: 'data', id: 3, data: { id: 3, name: 'r3' }, index: 2 }, ev);
      expect(harness.selection()).toEqual([1, 3]);
      m.handleRowClick({ kind: 'data', id: 1, data: { id: 1, name: 'r1' }, index: 0 }, ev);
      expect(harness.selection()).toEqual([3]);
    });
  });

  it('multi mode shift-click selects the range as a union', () => {
    TestBed.runInInjectionContext(() => {
      const harness = new TestHarnessComponent();
      const { m } = harness.make('multi');
      m.handleRowClick(
        { kind: 'data', id: 1, data: { id: 1, name: 'r1' }, index: 0 },
        {} as MouseEvent
      );
      m.handleRowClick({ kind: 'data', id: 3, data: { id: 3, name: 'r3' }, index: 2 }, {
        shiftKey: true,
      } as MouseEvent);
      expect([...harness.selection()].sort()).toEqual([1, 2, 3]);
    });
  });

  it('toggleSelectAll selects all data rows, then clears', () => {
    TestBed.runInInjectionContext(() => {
      const harness = new TestHarnessComponent();
      const { m } = harness.make('multi');
      m.toggleSelectAll();
      expect([...harness.selection()].sort()).toEqual([1, 2, 3, 4]);
      m.toggleSelectAll();
      expect(harness.selection()).toEqual([]);
    });
  });

  it('headerCheckboxValue is tri-state', () => {
    TestBed.runInInjectionContext(() => {
      const harness = new TestHarnessComponent();
      const { m } = harness.make('multi');
      expect(m.headerCheckboxValue()).toBe(false);
      harness.selection.set([1]);
      expect(m.headerCheckboxValue()).toBe(null);
      harness.selection.set([1, 2, 3, 4]);
      expect(m.headerCheckboxValue()).toBe(true);
    });
  });

  it('ArrowDown moves focus, scrolls, and selects in single mode', () => {
    TestBed.runInInjectionContext(() => {
      const harness = new TestHarnessComponent();
      const { m, focusedRowIndex, scrollToIndex } = harness.make('single');
      m.onKeyDown({
        key: 'ArrowDown',
        preventDefault() {},
        stopPropagation() {},
      } as unknown as KeyboardEvent);
      expect(focusedRowIndex()).toBe(0);
      expect(harness.selection()).toEqual([1]);
      expect(scrollToIndex).toHaveBeenCalledWith(0);
    });
  });

  it('ArrowUp clamps at the top', () => {
    TestBed.runInInjectionContext(() => {
      const harness = new TestHarnessComponent();
      const { m, focusedRowIndex } = harness.make('single');
      focusedRowIndex.set(0);
      m.onKeyDown({
        key: 'ArrowUp',
        preventDefault() {},
        stopPropagation() {},
      } as unknown as KeyboardEvent);
      expect(focusedRowIndex()).toBe(0);
    });
  });

  it('does nothing when selectionMode is null', () => {
    TestBed.runInInjectionContext(() => {
      const harness = new TestHarnessComponent();
      const viewRows = signal<readonly FormattedTableRow<Row>[]>(dataRows([1, 2]));
      const m = new TableSelectionModel<Row, 'id'>({
        viewRows,
        selectionMode: signal<TableSelectionMode | null>(null),
        fieldId: signal('id'),
        selection: harness.selection,
        focusedRowIndex: signal<number | null>(null),
        scrollToIndex: () => {},
      });
      m.handleRowClick(
        { kind: 'data', id: 1, data: { id: 1, name: 'r1' }, index: 0 },
        {} as MouseEvent
      );
      expect(harness.selection()).toEqual([]);
    });
  });
});
