import { Component, signal } from '@angular/core';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigSelect, JigInput, JigInputField],
  selector: 'jig-demo-select-editable-custom',
  template: `<jig-input-field>
    <jig-select
      #select
      [options]="options"
      [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
      [editable]="true"
      (valueChange)="changed($event)"
      [value]="value()"
    >
      <input ngnInput title="Custom Editable Input" type="text" />
    </jig-select>
  </jig-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_EditableCustom {
  protected readonly options = exampleData.items.flatPreformatted;

  protected readonly value = signal<string | null>(null);

  protected changed(value: string | null): void {
    console.log('Selected value:', value);
  }
}
