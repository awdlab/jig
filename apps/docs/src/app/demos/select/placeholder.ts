import { Component } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect, NgnInputField],
  selector: 'ngn-demo-select-placeholder',
  template: `<ngn-input-field>
    <ngn-select [options]="options" placeholder="Select an option…" />
  </ngn-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Placeholder {
  protected readonly options = exampleData.items.flatPreformatted;
}
