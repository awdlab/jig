import { Component } from '@angular/core';
import { Select } from '@ngneers/controls/select';

import { options } from './_options';

@Component({
  imports: [Select],
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
  public readonly options = options;
}
