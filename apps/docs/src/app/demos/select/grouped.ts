import { Component } from '@angular/core';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect],
  selector: 'ngn-select-grouped',
  template: `
    <ngn-select
      #select
      [fields]="{
        value: 'id',
        label: 'label',
        children: 'items',
      }"
      [filter]="true"
      [options]="options"
    />
  `,
})
export class Demo_Select_Grouped {
  protected readonly options = exampleData.items.grouped;
}
