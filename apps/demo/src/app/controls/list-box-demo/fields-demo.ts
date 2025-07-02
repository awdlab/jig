import { Component } from '@angular/core';
import { ListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [ListBox],
  template: `
    <ngn-list-box
      [fields]="{
        value: 'id',
        label: 'label',
      }"
      [items]="items"
      style="display: block; height: 300px;"
    />
  `,
})
export class ListBox_Fields_Component {
  public readonly items = exampleData.items.flat;
}
