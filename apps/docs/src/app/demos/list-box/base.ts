import { Component } from '@angular/core';
import { AwdListBox } from '@awdlab/jig/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [AwdListBox],
  selector: 'jig-demo-list-box-base',
  template: `<jig-list-box [items]="items" style="height: 300px;" />`,
})
export class Demo_ListBox_Base {
  protected readonly items = exampleData.items.flatPreformatted;
}
