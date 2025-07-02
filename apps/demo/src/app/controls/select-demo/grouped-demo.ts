import { Component } from '@angular/core';
import { Select } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [Select],
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
  public readonly options = exampleData.items.grouped;
}
