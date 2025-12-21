import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api/ng';
import { NgnScrollerItem } from '@ngneers/controls/scroller';
import { setInputSignalValue } from '@ngneers/controls/utils-ng';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { FormattedTableRow } from './types';

@Directive({
  selector: '[ngnTableRow]',
  host: {
    '[attr.aria-rowindex]': 'ngnTableRow().index + 2',
    '[style.--ngn-table-row-index]': 'ngnTableRow().index + 2',
  },
})
export class NgnTableRow<T> extends NgnScrollerItem {
  public readonly ngnTableRow = input.required<FormattedTableRow<T>>();
  public override readonly ngnScrollerItem = input<object>({});
  private readonly _element = inject(ElementRef<HTMLElement>);
  private readonly _theme = injectThemeTemplate(tableControlTemplate);

  constructor() {
    super();
    effect(() => {
      const row = this.ngnTableRow();
      setInputSignalValue(this.ngnScrollerItem, row);
    });
    this.prepareDom();
  }

  private prepareDom() {
    this._element.nativeElement.classList.toggle(this._theme.class('row'), true);
  }
}
