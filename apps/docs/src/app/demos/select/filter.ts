import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSelect],
  selector: 'ngn-demo-select-filter',
  template: `<ngn-select #select [filter]="true" [options]="options" />`,
  host: { class: 'w-48' },
})
export class Demo_Select_Filter {
  protected readonly options = exampleData.items.flatPreformatted;
}
