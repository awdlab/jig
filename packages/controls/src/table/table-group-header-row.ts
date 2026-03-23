import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api/ng';
import { NgnScrollerItem } from '@ngneers/controls/scroller';
import { toggleClass } from '@ngneers/controls/utils';
import { setInputSignalValue } from '@ngneers/controls/utils-ng';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import type { FormattedTableGroupHeaderRow } from './types';

@Directive({
  selector: '[ngnTableGroupHeaderTr]',
  host: {
    '[attr.aria-rowindex]': 'ngnTableGroupHeaderTr().index + 2',
    '[style.--ngn-table-row-index]': 'ngnTableGroupHeaderTr().index + 2',
  },
})
export class NgnTableGroupHeaderTr extends NgnScrollerItem {
  public readonly ngnTableGroupHeaderTr = input.required<FormattedTableGroupHeaderRow>();
  public override readonly ngnScrollerItem = input<object>({});
  private readonly _element = inject(ElementRef<HTMLElement>);
  protected readonly theme = injectThemeTemplate(tableControlTemplate);

  constructor() {
    super();
    effect(() => {
      const row = this.ngnTableGroupHeaderTr();
      setInputSignalValue(this.ngnScrollerItem, row);
    });
    this.prepareDom();
  }

  private prepareDom() {
    toggleClass(this._element.nativeElement, this.theme.class('row'), true);
    toggleClass(this._element.nativeElement, this.theme.class('group-header-row'), true);
  }
}
