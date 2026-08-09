import { Component } from '@angular/core';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [AwdSelect, AwdInputField],
  selector: 'jig-demo-select-filter',
  template: `<jig-input-field>
    <jig-select #select [filter]="true" [options]="options" />
  </jig-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Filter {
  protected readonly options = exampleData.items.flatPreformatted;
}
