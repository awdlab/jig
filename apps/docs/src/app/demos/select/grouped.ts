import { Component } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigSelect, JigInputField],
  selector: 'jig-demo-select-grouped',
  template: `<jig-input-field>
    <jig-select #select [filter]="true" [options]="options" />
  </jig-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Grouped {
  protected readonly options = exampleData.items.groupedPreformatted;
}
