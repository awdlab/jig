import { Component } from '@angular/core';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect],
  selector: 'ngn-demo-select-filter',
  template: `<ngn-select #select [filter]="true" [options]="options" />`,
})
export class Demo_Select_Filter {
  protected readonly options = exampleData.items.flatPreformatted;
}
