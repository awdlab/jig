import { Component } from '@angular/core';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect],
  selector: 'ngn-select-base',
  template: `<ngn-select
    #select
    [options]="options"
    [virtual]="true"
    [itemHeight]="40"
    [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
  />`,
})
export class Demo_Select_Base {
  protected readonly options = exampleData.items.flatPreformatted;
}
