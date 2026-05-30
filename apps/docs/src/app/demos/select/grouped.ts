import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSelect, NgnInputField],
  selector: 'ngn-demo-select-grouped',
  template: `<ngn-input-field>
    <ngn-select #select [filter]="true" [options]="options" />
  </ngn-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Grouped {
  protected readonly options = exampleData.items.groupedPreformatted;
}
