import { Component, ElementRef, model, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { TableColumnLayoutModel } from './table-column-layout-model';

import type { JigTableTh } from './table-header-cell';

function cell(id: string): JigTableTh {
  return {
    ngnTableTh: signal(id),
    element: new ElementRef(document.createElement('th')),
    minSize: signal('0px'),
    maxSize: signal('100%'),
  } as unknown as JigTableTh;
}

// `model()` may only be called in a class-member initializer, so the two-way
// `columnOrder` model is hosted on a tiny standalone harness component (mirrors
// the pattern used by table-selection-model.spec.ts).
@Component({
  selector: 'test-harness',
  standalone: true,
  template: '',
})
class TestHarnessComponent {
  columnOrder = model<string[]>([]);

  make(columnOrder: string[] = []) {
    this.columnOrder.set(columnOrder);
    const m = new TableColumnLayoutModel({
      element: new ElementRef(document.createElement('div')),
      resizable: signal(false),
      reorderable: signal(false),
      resizeMode: signal('adjacent'),
      lockSizes: signal(false),
      columnOrder: this.columnOrder,
      themeClass: (name: string) => `jig-table-${name}`,
    });
    return { m, order: this.columnOrder };
  }
}

describe('TableColumnLayoutModel', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [TestHarnessComponent] }));

  it('falls back to registration order when columnOrder is empty', () => {
    TestBed.runInInjectionContext(() => {
      const { m } = new TestHarnessComponent().make();
      ['a', 'b', 'c'].forEach(id => m.registerHeaderCell(cell(id)));
      expect([...m.columnOrderMap().entries()]).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });
  });

  it('honors columnOrder, drops unknown keys, appends new columns', () => {
    TestBed.runInInjectionContext(() => {
      const { m } = new TestHarnessComponent().make(['c', 'zzz', 'a']);
      ['a', 'b', 'c'].forEach(id => m.registerHeaderCell(cell(id)));
      // 'zzz' dropped (unknown), 'b' appended (missing from order)
      expect([...m.columnOrderMap().keys()]).toEqual(['c', 'a', 'b']);
    });
  });

  it('derives contiguous sticky-start columns and breaks on the first gap', () => {
    TestBed.runInInjectionContext(() => {
      const { m } = new TestHarnessComponent().make();
      ['a', 'b', 'c'].forEach(id => m.registerHeaderCell(cell(id)));
      m.registerStickyColumn('a', 'start');
      m.registerStickyColumn('c', 'start'); // not contiguous (b is not sticky)
      expect(m.stickyStartColumns()).toEqual(['a']);
      expect(m.getStickyInfo('a')).toEqual({ side: 'start', index: 0, isEdge: true });
      expect(m.getStickyInfo('c')).toBeNull();
    });
  });

  it('toggles hasSelectionColumn via register/unregister', () => {
    TestBed.runInInjectionContext(() => {
      const { m } = new TestHarnessComponent().make();
      expect(m.hasSelectionColumn()).toBe(false);
      m.registerSelectionColumn();
      expect(m.hasSelectionColumn()).toBe(true);
      m.unregisterSelectionColumn();
      expect(m.hasSelectionColumn()).toBe(false);
    });
  });
});
