import { Component } from '@angular/core';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnListBox],
  selector: 'ngn-list-box-fields',
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
export class Demo_ListBox_Fields {
  protected readonly items = exampleData.items.flat;
}
