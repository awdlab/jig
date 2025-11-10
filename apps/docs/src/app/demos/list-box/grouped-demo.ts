import { Component } from '@angular/core';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnListBox],
  selector: 'ngn-demo-list-box-grouped-demo',
  template: `
    <ngn-list-box
      [fields]="{
        value: 'id',
        label: 'label',
        children: 'items',
      }"
      [items]="items"
      style="display: block; height: 300px;"
    />
  `,
})
export class Demo_ListBox_Grouped {
  protected readonly items = exampleData.items.grouped;
}
