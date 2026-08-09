import { Component } from '@angular/core';
import { transformToNgnItems } from '@awdlab/jig/api';
import { NgnListBox } from '@awdlab/jig/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnListBox],
  selector: 'awd-demo-list-box-grouped-demo',
  template: ` <awd-list-box [items]="items" style="display: block; height: 300px;" /> `,
})
export class Demo_ListBox_Grouped {
  protected readonly items = transformToNgnItems(exampleData.items.grouped, {
    value: 'id',
    label: 'label',
    children: 'items',
  });
}
