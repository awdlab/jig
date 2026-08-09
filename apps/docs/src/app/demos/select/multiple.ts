import { Component } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect, NgnInputField],
  selector: 'awd-demo-select-multiple',
  template: `
    <awd-input-field>
      <awd-select
        #select
        [multiple]="true"
        [filter]="true"
        [options]="options"
        (valueChange)="log($event)"
      />
    </awd-input-field>
  `,
  host: { class: 'w-48' },
})
export class Demo_Select_Multiple {
  protected readonly options = exampleData.items.groupedPreformatted;

  protected log(value: string[] | null) {
    console.log('Selected values:', value);
  }
}
