import { Component } from '@angular/core';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnListBox],
  selector: 'ngn-list-box-multiple',
  template: `<ngn-list-box
    [items]="items"
    [selectable]="true"
    [multiple]="true"
    style="display: block; height: 300px;"
  />`,
})
export class Demo_ListBox_Multiple {
  protected readonly items = exampleData.items.flatPreformatted;
}
