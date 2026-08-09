import { Component } from '@angular/core';
import { JigListBox } from '@awdlab/jig/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigListBox],
  selector: 'jig-demo-list-box-multiple',
  template: `<jig-list-box
    [items]="items"
    [selectable]="true"
    [multiple]="true"
    style="display: block; height: 300px;"
  />`,
})
export class Demo_ListBox_Multiple {
  protected readonly items = exampleData.items.flatPreformatted;
}
