import { Component, ChangeDetectionStrategy } from '@angular/core';
import { transformToNgnItems } from '@ngneers/controls/api';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnListBox],
  selector: 'ngn-demo-list-box-grouped-demo',
  template: ` <ngn-list-box [items]="items" style="display: block; height: 300px;" /> `,
})
export class Demo_ListBox_Grouped {
  protected readonly items = transformToNgnItems(exampleData.items.grouped, {
    value: 'id',
    label: 'label',
    children: 'items',
  });
}
