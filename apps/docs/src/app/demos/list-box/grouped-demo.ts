import { Component } from '@angular/core';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnListBox],
  selector: 'ngn-list-box-grouped',
  template: `
    <ngn-list-box
      [fields]="{
        value: 'id',
        label: 'label',
        groupItems: 'items',
      }"
      [items]="items"
      style="display: block; height: 300px;"
    />
  `,
})
export class ListBox_Grouped_Component {
  protected readonly items = exampleData.items.grouped;
}
