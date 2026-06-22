import { Component, signal } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect, NgnInput, NgnInputField],
  selector: 'ngn-demo-select-editable-custom',
  template: `<ngn-input-field>
    <ngn-select
      #select
      [options]="options"
      [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
      [editable]="true"
      (valueChange)="changed($event)"
      [value]="value()"
    >
      <input ngnInput title="Custom Editable Input" type="text" />
    </ngn-select>
  </ngn-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_EditableCustom {
  protected readonly options = exampleData.items.flatPreformatted;

  protected readonly value = signal<string | null>(null);

  protected changed(value: string | null): void {
    console.log('Selected value:', value);
  }
}
