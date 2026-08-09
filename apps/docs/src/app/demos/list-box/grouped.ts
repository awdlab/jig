import { Component } from '@angular/core';
import { transformToJigItems } from '@awdlab/jig/api';
import { AwdListBox } from '@awdlab/jig/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [AwdListBox],
  selector: 'jig-demo-list-box-grouped-demo',
  template: ` <jig-list-box [items]="items" style="display: block; height: 300px;" /> `,
})
export class Demo_ListBox_Grouped {
  protected readonly items = transformToJigItems(exampleData.items.grouped, {
    value: 'id',
    label: 'label',
    children: 'items',
  });
}
