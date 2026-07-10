import { computed, Directive, effect, ElementRef, inject, input, Type } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api/ng';
import { getNearestNgnInstanceSig } from '@ngneers/controls/base';
import { NgnScrollerItem } from '@ngneers/controls/scroller';
import { toggleClass } from '@ngneers/controls/utils';
import { setInputSignalValue } from '@ngneers/controls/utils-ng';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTable } from './table';

import type { FormattedTableDataRow } from './types';

@Directive({
  selector: '[ngnTableBodyTr]',
  host: {
    '[attr.aria-rowindex]': 'ngnTableBodyTr().index + 2',
    '[style.--ngn-table-row-index]': 'ngnTableBodyTr().index + 2',
    '[class]': `theme.classes({
      'even': ngnTableBodyTr().index % 2 === 0,
      'selected-row': selected(),
      'focused-row': focused(),
      'active-row': active()
    })`,
    '[attr.aria-selected]': 'selectable() ? selected() : null',
    role: 'row',
    '(click)': 'onRowClick($event)',
  },
})
export class NgnTableBodyTr<T> extends NgnScrollerItem {
  /** The formatted data row this `<tr>` renders. */
  public readonly ngnTableBodyTr = input.required<FormattedTableDataRow<T>>();
  /** The item bound to the underlying scroller entry; kept in sync with {@link ngnTableBodyTr}. */
  public override readonly ngnScrollerItem = input<object>({});
  private readonly _element = inject(ElementRef<HTMLElement>);
  protected readonly theme = injectThemeTemplate(tableControlTemplate);

  private readonly _table = getNearestNgnInstanceSig<Type<NgnTable<any, any>>>(
    this._element.nativeElement,
    NgnTable
  );

  protected readonly selectable = computed(() => !!this._table()?.selectionMode());

  protected readonly selected = computed(() => {
    const table = this._table();
    if (!table || !table.selectionMode()) return false;
    const row = this.ngnTableBodyTr();
    return table.isRowSelected(row.id);
  });

  /**
   * Whether this row is the table's single current-row for keyboard
   * navigation ({@link NgnTable.focusedRowIndex}). Tracks selection keyboard
   * nav when {@link NgnTable.selectionMode} is set, and also tracks
   * row-actions keyboard nav on non-selectable tables that have row actions,
   * so a keyboard user always sees which row is current.
   */
  protected readonly focused = computed(() => {
    const table = this._table();
    if (!table) return false;
    return table.focusedRowIndex() === this.ngnTableBodyTr().index;
  });

  /** Whether this row's action bar currently has DOM focus. */
  protected readonly active = computed(() => {
    const table = this._table();
    if (!table) return false;
    return table.isRowInActions(this.ngnTableBodyTr().index);
  });

  constructor() {
    super();
    effect(() => {
      const row = this.ngnTableBodyTr();
      setInputSignalValue(this.ngnScrollerItem, row);
    });
    this.prepareDom();
  }

  private prepareDom() {
    toggleClass(this._element.nativeElement, this.theme.class('row'), true);
  }

  protected onRowClick(event: MouseEvent): void {
    const table = this._table();
    if (!table || !table.selectionMode()) return;
    table.handleRowClick(this.ngnTableBodyTr(), event);
  }
}
