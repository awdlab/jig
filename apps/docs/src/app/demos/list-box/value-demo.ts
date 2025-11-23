import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
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
    item: '' as (typeof this.items)[number]['value'],
  });

  protected readonly value = signal<(typeof this.items)[number]['value'] | null>(null);
}
