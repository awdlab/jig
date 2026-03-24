import {
  ComponentRef,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  Renderer2,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api/ng';
import { getNearestNgnInstanceSig } from '@ngneers/controls/base';
import { NgnCheckbox } from '@ngneers/controls/checkbox';
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
      'focused-row': focused()
    })`,
    '[attr.aria-selected]': 'selectable() ? selected() : null',
    role: 'row',
    '(click)': 'onRowClick($event)',
  },
})
export class NgnTableBodyTr<T> extends NgnScrollerItem implements OnDestroy {
  public readonly ngnTableBodyTr = input.required<FormattedTableDataRow<T>>();
  public override readonly ngnScrollerItem = input<object>({});
  private readonly _element = inject(ElementRef<HTMLElement>);
  private readonly _renderer = inject(Renderer2);
  private readonly _vcr = inject(ViewContainerRef);
  protected readonly theme = injectThemeTemplate(tableControlTemplate);

  private readonly _table = getNearestNgnInstanceSig<Type<NgnTable<any, any>>>(
    this._element.nativeElement,
    NgnTable
  );

  private _checkboxTd: HTMLElement | null = null;
  private _checkboxRef: ComponentRef<NgnCheckbox<boolean>> | null = null;

  protected readonly selectable = computed(() => !!this._table()?.selectionMode());

  protected readonly selected = computed(() => {
    const table = this._table();
    if (!table || !table.selectionMode()) return false;
    const row = this.ngnTableBodyTr();
    return table.isRowSelected(row.id as any);
  });

  protected readonly focused = computed(() => {
    const table = this._table();
    if (!table || !table.selectionMode()) return false;
    const row = this.ngnTableBodyTr();
    return table.focusedRowIndex() === row.index;
  });

  constructor() {
    super();
    effect(() => {
      const row = this.ngnTableBodyTr();
      setInputSignalValue(this.ngnScrollerItem, row);
    });
    this.prepareDom();

    // Reactively create/remove checkbox cell
    effect(() => {
      const table = this._table();
      if (!table) return;
      const show = table.showCheckboxes();

      if (show && !this._checkboxTd) {
        this._createRowCheckbox(table);
      } else if (!show && this._checkboxTd) {
        this._destroyRowCheckbox();
      }
    });

    // Reactively update checkbox state.
    // Read signals BEFORE null guard to establish dependencies even when checkbox
    // hasn't been created yet — ensures the effect re-runs on selection changes.
    effect(() => {
      const isSelected = this.selected();
      const isFocused = this.focused();
      const row = this.ngnTableBodyTr();

      const ref = this._checkboxRef;
      const td = this._checkboxTd;
      if (!ref || !td) return;

      ref.setInput('value', isSelected);
      td.style.setProperty('--ngn-table-row-index', String(row.index + 2));
      toggleClass(td, this.theme.class('selected-row-cell'), isSelected);
      toggleClass(td, this.theme.class('focused-row-cell'), isFocused);
    });
  }

  public ngOnDestroy(): void {
    this._destroyRowCheckbox();
  }

  private _createRowCheckbox(table: NgnTable<any, any>): void {
    const td = this._renderer.createElement('td') as HTMLElement;
    toggleClass(td, this.theme.class('cell'), true);
    toggleClass(td, this.theme.class('selection-column'), true);

    const row = this.ngnTableBodyTr();
    td.style.setProperty('--ngn-table-row-index', String(row.index + 2));

    this._checkboxRef = this._vcr.createComponent(NgnCheckbox);
    const cbEl = this._checkboxRef.location.nativeElement;
    cbEl.classList.add(this.theme.class('selection-checkbox'));
    this._checkboxRef.setInput('value', table.isRowSelected(row.id as any));

    td.appendChild(cbEl);
    td.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      table.handleCheckboxChange(this.ngnTableBodyTr());
    });

    const tr = this._element.nativeElement;
    tr.insertBefore(td, tr.firstChild);
    this._checkboxTd = td;
  }

  private _destroyRowCheckbox(): void {
    this._checkboxTd?.remove();
    this._checkboxTd = null;
    this._checkboxRef?.destroy();
    this._checkboxRef = null;
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
