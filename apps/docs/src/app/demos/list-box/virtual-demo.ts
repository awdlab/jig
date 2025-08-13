import { Component } from '@angular/core';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnListBox],
  selector: 'ngn-list-box-virtual',
  template: `
    <ngn-list-box
      [items]="items"
      [virtual]="true"
      [itemHeight]="40"
      style="display: block; height: 300px;"
    />
  `,
})
export class ListBox_Virtual_Component {
  protected readonly items = exampleData.items.groupedPreformatted;
}
