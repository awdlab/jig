import {
  afterNextRender,
  afterRenderEffect,
  computed,
  Directive,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api/ng';
import { getNearestNgnInstance } from '@ngneers/controls/base';
import { toggleClass } from '@ngneers/controls/utils';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTable } from './table';

/**
 * Lightweight body-cell directive. Deliberately does **not** extend `NgnBase`:
 * a `<td>` is instantiated once per cell (thousands per table), so it avoids the
 * per-control overhead (kind/color effects, `viewChildren` query, theme kind/color
 * injection, leave-animation hooks). It only does what a cell needs — apply the
 * `cell` class, expose its visual column index, and mirror sticky positioning.
 */
@Directive({
  selector: '[ngnTableTd]',
  host: { role: 'gridcell', '[style.--ngn-table-column-index]': '_visualColumnIndex()' },
})
export class NgnTableTd {
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly theme = injectThemeTemplate(tableControlTemplate);
  private readonly _table = signal<NgnTable<any, any> | null>(null);

  /** 0-based logical (DOM) index of this cell within its row. */
  private readonly _logicalIndex = signal(0);

  /** 1-based visual column index, remapped through the table's column order. */
  protected readonly _visualColumnIndex = computed(() => {
    const logicalIndex = this._logicalIndex();
    const table = this._table();
    if (table) {
      // Subtract the selection column offset so DOM index aligns with registered header cells.
      const offset = table.showCheckboxes() ? 1 : 0;
      return table.getVisualColumnIndex(logicalIndex - offset);
    }
    return logicalIndex + 1;
  });

  private readonly _columnId = computed(() => {
    const table = this._table();
    if (!table) return null;
    const offset = table.showCheckboxes() ? 1 : 0;
    const logicalIndex = this._logicalIndex() - offset;
    const cells = table.getRegisteredHeaderCells();
    return cells[logicalIndex]?.ngnTableTh() ?? null;
  });

  private readonly _stickyInfo = computed(() => {
    const table = this._table();
    const columnId = this._columnId();
    if (!table || !columnId) return null;
    return table.getStickyInfo(columnId);
  });

  constructor() {
    this.prepareDom();
    const el = this._element.nativeElement;
    const parent = el.parentElement?.children;
    if (parent) {
      const index = Array.from(parent).findIndex(child => child === el);
      this._logicalIndex.set(index);
    }

    afterNextRender(() => {
      const table = getNearestNgnInstance(el, NgnTable) as NgnTable<any, any> | null;
      this._table.set(table);
    });

    afterRenderEffect(() => {
      const info = this._stickyInfo();
      const el = this._element.nativeElement;
      toggleClass(el, this.theme.class('sticky-start'), info?.side === 'start');
      toggleClass(el, this.theme.class('sticky-end'), info?.side === 'end');
      toggleClass(el, this.theme.class('sticky-start-edge'), info?.side === 'start' && info.isEdge);
      toggleClass(el, this.theme.class('sticky-end-edge'), info?.side === 'end' && info.isEdge);

      if (info) {
        el.style.position = 'sticky';
        if (info.side === 'start') {
          el.style.left = `var(--ngn-sticky-start-offset-${info.index})`;
          el.style.removeProperty('right');
        } else {
          el.style.right = `var(--ngn-sticky-end-offset-${info.index})`;
          el.style.removeProperty('left');
        }
      } else {
        el.style.removeProperty('position');
        el.style.removeProperty('left');
        el.style.removeProperty('right');
      }
    });
  }

  private prepareDom() {
    toggleClass(this._element.nativeElement, this.theme.class('cell'), true);
  }
}
