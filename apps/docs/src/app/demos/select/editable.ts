import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSelect, NgnInputField],
  selector: 'ngn-demo-select-editable',
  template: `<ngn-input-field>
    <ngn-select
      #select
      [options]="options"
      [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
      [editable]="true"
      (valueChange)="changed($event)"
      [value]="value()"
    />
  </ngn-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Editable {
  protected readonly options = exampleData.items.flatPreformatted;

  protected readonly value = signal<string | null>(null);

  protected changed(value: string | null): void {
    console.log('Selected value:', value);
  }
}
