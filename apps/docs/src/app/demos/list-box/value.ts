import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnItemsValue, NgnItemValue } from '@ngneers/controls/api';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnListBox],
  selector: 'ngn-demo-list-box-value-demo',
  template: `
    <ngn-list-box
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

  constructor() {
    // const a = new NgnListBox<typeof this.items>();
    // const b = a.items();
    // const c = a.value();
    // const d = a['valueArray']();

    type A = NgnItemsValue<typeof this.items>;
    const a: A = 'africa';
    type B = NgnItemValue<(typeof this.items)[0]>;
  }
}
