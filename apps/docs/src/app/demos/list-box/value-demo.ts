import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnListBox, FormsModule],
  selector: 'ngn-list-box-value',
  template: `
    <ngn-list-box
      [items]="items"
      style="display: block; height: 300px;"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
      [selectable]="true"
    />
  `,
})
export class Demo_ListBox_Value {
  protected readonly items = exampleData.items.groupedPreformatted;
  protected readonly value = signal<(typeof this.items)[number]['value'] | null>(null);
}
