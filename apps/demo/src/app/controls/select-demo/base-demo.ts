import { Component } from '@angular/core';
import { Select } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [Select],
  selector: 'ngn-select-base',
  template: `<ngn-select
    #select
    [options]="options"
    [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
  />`,
})
export class Select_Base_Component {
  public readonly options = exampleData.items.flatPreformatted;
}
