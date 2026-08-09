import { Component, signal } from '@angular/core';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect, NgnInput, NgnInputField],
  selector: 'awd-demo-select-editable-custom',
  template: `<awd-input-field>
    <awd-select
      #select
      [options]="options"
      [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
      [editable]="true"
      (valueChange)="changed($event)"
      [value]="value()"
    >
      <input ngnInput title="Custom Editable Input" type="text" />
    </awd-select>
  </awd-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_EditableCustom {
  protected readonly options = exampleData.items.flatPreformatted;

  protected readonly value = signal<string | null>(null);

  protected changed(value: string | null): void {
    console.log('Selected value:', value);
  }
}
