import { Component, signal } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect, NgnInputField],
  selector: 'awd-demo-select-editable',
  template: `<awd-input-field>
    <awd-select
      #select
      [options]="options"
      [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
      [editable]="true"
      (valueChange)="changed($event)"
      [value]="value()"
    />
  </awd-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Editable {
  protected readonly options = exampleData.items.flatPreformatted;

  protected readonly value = signal<string | null>(null);

  protected changed(value: string | null): void {
    console.log('Selected value:', value);
  }
}
