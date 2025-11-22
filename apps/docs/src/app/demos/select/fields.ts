import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSelect],
  selector: 'ngn-demo-select-fields',
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
export class Demo_Select_Fields {
  protected readonly options = exampleData.items.flat;
}
