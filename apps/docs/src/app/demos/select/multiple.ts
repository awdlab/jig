import { Component } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigSelect, JigInputField],
  selector: 'jig-demo-select-multiple',
  template: `
    <jig-input-field>
      <jig-select
        #select
        [multiple]="true"
        [filter]="true"
        [options]="options"
        (valueChange)="log($event)"
      />
    </jig-input-field>
  `,
  host: { class: 'w-48' },
})
export class Demo_Select_Multiple {
  protected readonly options = exampleData.items.groupedPreformatted;

  protected log(value: string[] | null) {
    console.log('Selected values:', value);
  }
}
