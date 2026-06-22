import { Component } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect, NgnInputField],
  selector: 'ngn-demo-select-filter',
  template: `<ngn-input-field>
    <ngn-select #select [filter]="true" [options]="options" />
  </ngn-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Filter {
  protected readonly options = exampleData.items.flatPreformatted;
}
