import { Component } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect, NgnInputField],
  selector: 'awd-demo-select-placeholder',
  template: `<awd-input-field>
    <awd-select [options]="options" placeholder="Select an option…" />
  </awd-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Placeholder {
  protected readonly options = exampleData.items.flatPreformatted;
}
