import { Component } from '@angular/core';
import { Select } from '@ngneers/controls/select';

import { optionsPreformatted } from './_options';

@Component({
  imports: [Select],
  template: `<ngn-select
    #select
    [filter]="true"
    [options]="options"
    [popoverOptions]="{ sizeConstraints: { maxHeight: '200px' } }"
  />`,
})
export class Select_Filter_Component {
  public readonly options = optionsPreformatted;
}
