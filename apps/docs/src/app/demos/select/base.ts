import { Component } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect, NgnInputField],
  selector: 'awd-demo-select-base',
  template: `<awd-input-field>
    <awd-select
      #select
      [options]="options"
      [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
    />
  </awd-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Base {
  protected readonly options = exampleData.items.flatPreformatted;
}
