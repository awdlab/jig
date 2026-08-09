import { Component, signal } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigSelect, JigInputField],
  selector: 'jig-demo-select-editable',
  template: `<jig-input-field>
    <jig-select
      #select
      [options]="options"
      [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
      [editable]="true"
      (valueChange)="changed($event)"
      [value]="value()"
    />
  </jig-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Editable {
  protected readonly options = exampleData.items.flatPreformatted;

  protected readonly value = signal<string | null>(null);

  protected changed(value: string | null): void {
    console.log('Selected value:', value);
  }
}
