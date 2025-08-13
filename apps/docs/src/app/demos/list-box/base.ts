import { Component } from '@angular/core';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnListBox],
  selector: 'ngn-list-box-base',
  template: `<ngn-list-box [items]="items" style="display: block; height: 300px;" />`,
})
export class Demo_ListBox_Base {
  protected readonly items = exampleData.items.flatPreformatted;
}
