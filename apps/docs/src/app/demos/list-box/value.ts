import { Component, signal } from '@angular/core';
import { NgnListBox } from '@awdlab/jig/list-box';

import { exampleData } from '../../helper/data';

import type { NgnItemsValue } from '@awdlab/jig/api';

@Component({
  imports: [NgnListBox],
  selector: 'awd-demo-list-box-value-demo',
  template: `
    <awd-list-box
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
    item: '' as NgnItemsValue<typeof this.items>,
  });

  protected readonly value = signal<NgnItemsValue<typeof this.items> | null>(null);
}
