import { Component } from '@angular/core';
import { Select } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [Select],
  selector: 'ngn-select-filter',
  template: `<ngn-select
    #select
    [filter]="true"
    [options]="options"
    [popoverOptions]="{ sizeConstraints: { maxHeight: '200px' } }"
  />`,
})
export class Select_Filter_Component {
  public readonly options = exampleData.items.flatPreformatted;
}
