import { Component, signal } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect, NgnInput],
  selector: 'ngn-select-editable',
  template: `<ngn-select
    #select
    [options]="options"
    [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
    [editable]="true"
    (valueChange)="changed($event)"
    [value]="value()"
    style="width: 200px"
  >
    <input ngnInput title="Custom Editable Input" type="text" />
  </ngn-select>`,
})
export class Select_Editable_Custom_Component {
  protected readonly options = exampleData.items.flatPreformatted;

  protected readonly value = signal<string | null>(null);

  protected changed(value: string | null): void {
    console.log('Selected value:', value);
  }
}
