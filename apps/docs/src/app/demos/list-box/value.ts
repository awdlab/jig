import { Component, signal } from '@angular/core';
import { JigListBox } from '@awdlab/jig/list-box';

import { exampleData } from '../../helper/data';

import type { JigItemsValue } from '@awdlab/jig/api';

@Component({
  imports: [JigListBox],
  selector: 'jig-demo-list-box-value-demo',
  template: `
    <jig-list-box
      [items]="items"
      style="display: block; height: 300px;"
      [value]="value()"
      (valueChange)="value.set($event)"
      [selectable]="true"
    />
  `,
})
export class Demo_ListBox_Value {
  protected readonly items = exampleData.items.groupedPreformatted;

  protected model = signal({
    item: '' as JigItemsValue<typeof this.items>,
  });

  protected readonly value = signal<JigItemsValue<typeof this.items> | null>(null);
}
