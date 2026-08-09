import { Component } from '@angular/core';
import { NgnListBox } from '@awdlab/jig/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnListBox],
  selector: 'awd-demo-list-box-base',
  template: `<awd-list-box [items]="items" style="height: 300px;" />`,
})
export class Demo_ListBox_Base {
  protected readonly items = exampleData.items.flatPreformatted;
}
