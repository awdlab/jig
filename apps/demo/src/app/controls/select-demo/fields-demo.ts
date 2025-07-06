import { Component } from '@angular/core';
import { Select } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [Select],
  selector: 'ngn-select-fields',
  template: `
    <ngn-select
      #select
      [fields]="{
        value: 'id',
        label: 'label',
      }"
      [options]="options"
    />
  `,
})
export class Select_Fields_Component {
  protected readonly options = exampleData.items.flat;
}
