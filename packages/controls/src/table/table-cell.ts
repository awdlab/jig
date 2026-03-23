import { afterNextRender, computed, Directive, signal } from '@angular/core';
import { getNearestNgnInstance, NgnBase } from '@ngneers/controls/base';
import { toggleClass } from '@ngneers/controls/utils';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTable } from './table';

@Directive({
  selector: '[ngnTableTd]',
  host: { '[style.--ngn-table-column-index]': '_visualColumnIndex()' },
})
export class NgnTableTd extends NgnBase<'table'> {
  protected readonly theme = this.injectThemeTemplate(tableControlTemplate);
  private readonly _table = signal<NgnTable<any, any> | null>(null);

  /** 0-based logical (DOM) index of this cell within its row. */
  private readonly _logicalIndex = signal(0);

  /** 1-based visual column index, remapped through the table's column order. */
  protected readonly _visualColumnIndex = computed(() => {
    const logicalIndex = this._logicalIndex();
    const table = this._table();
    if (table) {
      return table.getVisualColumnIndex(logicalIndex);
    }
    return logicalIndex + 1;
  });

  constructor() {
    super();
    this.prepareDom();
    const parent = this.element.nativeElement.parentElement?.children;
    if (parent) {
      const index = Array.from(parent).findIndex(child => child === this.element.nativeElement);
      this._logicalIndex.set(index);
    }

    afterNextRender(() => {
      const table = getNearestNgnInstance(this.element.nativeElement, NgnTable) as NgnTable<
        any,
        any
      > | null;
      this._table.set(table);
    });
  }

  private prepareDom() {
    toggleClass(this.element.nativeElement, this.theme.class('cell'), true);
  }
}
