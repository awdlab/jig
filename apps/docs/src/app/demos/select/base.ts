import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSelect, NgnInputField],
  selector: 'ngn-demo-select-base',
  template: `<ngn-input-field>
    <ngn-select
      #select
      [options]="options"
      [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
    />
  </ngn-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Base {
  protected readonly options = exampleData.items.flatPreformatted;
}
