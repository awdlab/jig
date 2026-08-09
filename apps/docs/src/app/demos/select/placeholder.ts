import { Component } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigSelect, JigInputField],
  selector: 'jig-demo-select-placeholder',
  template: `<jig-input-field>
    <jig-select [options]="options" placeholder="Select an option…" />
  </jig-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Placeholder {
  protected readonly options = exampleData.items.flatPreformatted;
}
