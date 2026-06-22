import { Component } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect, NgnInputField],
  selector: 'ngn-demo-select-multiple',
  template: `
    <ngn-input-field>
      <ngn-select
        #select
        [multiple]="true"
        [filter]="true"
        [options]="options"
        (valueChange)="log($event)"
      />
    </ngn-input-field>
  `,
  host: { class: 'w-48' },
})
export class Demo_Select_Multiple {
  protected readonly options = exampleData.items.groupedPreformatted;

  protected log(value: string[] | null) {
    console.log('Selected values:', value);
  }
}
