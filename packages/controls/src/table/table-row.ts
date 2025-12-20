import { Directive, effect, input } from '@angular/core';
import { NgnScrollerItem } from '@ngneers/controls/scroller';
import { setInputSignalValue } from '@ngneers/controls/utils-ng';

import { FormattedTableRow } from './types';

@Directive({
  selector: '[ngnTableRow]',
  host: { role: 'row', '[attr.aria-rowindex]': 'ngnTableRow().index + 2' },
})
export class NgnTableRow extends NgnScrollerItem {
  public readonly ngnTableRow = input.required<FormattedTableRow<unknown>>();
  public override readonly ngnScrollerItem = input<object>({});

  constructor() {
    super();
    effect(() => {
      const row = this.ngnTableRow();
      setInputSignalValue(this.ngnScrollerItem, row);
    });
  }
}
