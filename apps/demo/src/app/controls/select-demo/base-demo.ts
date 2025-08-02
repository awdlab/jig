import { Component } from '@angular/core';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect],
  selector: 'ngn-select-base',
  template: `<ngn-select
    #select
    [options]="options"
    [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
    style="width: 200px"
  />`,
})
export class Select_Base_Component {
  protected readonly options = exampleData.items.flatPreformatted;
}
