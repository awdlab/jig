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
        groupItems: 'items',
      }"
      [options]="options"
    />
  `,
})
export class Select_Grouped_Component {
  protected readonly options = exampleData.items.grouped;
}
