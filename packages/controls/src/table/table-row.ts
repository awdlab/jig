import { Directive, effect, input } from '@angular/core';
import { NgnScrollerItem } from '@ngneers/controls/scroller';
import { setInputSignalValue } from '@ngneers/controls/utils-ng';

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

  constructor() {
    super();
    effect(() => {
      const row = this.ngnTableRow();
      setInputSignalValue(this.ngnScrollerItem, row);
    });
  }
}
