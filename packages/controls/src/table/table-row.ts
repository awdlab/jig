import { computed, Directive, effect, ElementRef, inject, input, Type } from '@angular/core';
import { injectThemeTemplate } from '@awdlab/jig/api/ng';
import { getNearestJigInstanceSig } from '@awdlab/jig/base';
import { JigScrollerItem } from '@awdlab/jig/scroller';
import { toggleClass } from '@awdlab/jig/utils';
import { setInputSignalValue } from '@awdlab/jig/utils-ng';
import { tableControlTemplate } from '@awdlab/jig-themes/templates/table';

import { JigTable } from './table';

import type { FormattedTableDataRow } from './types';

/**
 * A table body `<tr>`. Bind it to the row object the `#body` template receives —
 * it drives selection, focus and active state, striping, and the row's place in
 * the virtual scroller.
 *
 * @category directive
 */
@Directive({
  selector: '[ngnTableBodyTr]',
  host: {
    '[attr.id]': 'rowElementId()',
    '[attr.aria-rowindex]': 'ngnTableBodyTr().index + 2',
    '[style.--jig-table-row-index]': 'ngnTableBodyTr().index + 2',
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
export class JigTableBodyTr<T> extends JigScrollerItem {
  /** The formatted data row this `<tr>` renders. */
  public readonly ngnTableBodyTr = input.required<FormattedTableDataRow<T>>();
  /** The item bound to the underlying scroller entry; kept in sync with {@link ngnTableBodyTr}. */
  public override readonly ngnScrollerItem = input<object>({});
  private readonly _element = inject(ElementRef<HTMLElement>);
  protected readonly theme = injectThemeTemplate(tableControlTemplate);

  private readonly _table = getNearestJigInstanceSig<Type<JigTable<any, any>>>(
    this._element.nativeElement,
    JigTable
  );

  protected readonly selectable = computed(() => !!this._table()?.selectionMode());

  /** Row id targeted by the grid's `aria-activedescendant`. */
  protected readonly rowElementId = computed(
    () => this._table()?.rowElementId(this.ngnTableBodyTr().index) ?? null
  );

  protected readonly selected = computed(() => {
    const table = this._table();
    if (!table || !table.selectionMode()) return false;
    const row = this.ngnTableBodyTr();
    return table.isRowSelected(row.id);
  });

  /**
   * Whether this row is the table's single current-row for keyboard
   * navigation ({@link JigTable.focusedRowIndex}). Tracks selection keyboard
   * nav when {@link JigTable.selectionMode} is set, and also tracks
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
