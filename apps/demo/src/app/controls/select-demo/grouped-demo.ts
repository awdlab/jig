import { Component } from '@angular/core';
import { Select } from '@ngneers/controls/select';

import { optionsGrouped } from './_options';

@Component({
  imports: [Select],
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
  public readonly options = optionsGrouped;
}
