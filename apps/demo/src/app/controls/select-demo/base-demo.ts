import { Component } from '@angular/core';
import { Select } from '@ngneers/controls/select';

import { optionsPreformatted } from './_options';

@Component({
  imports: [Select],
  template: `<ngn-select #select [options]="options" />`,
})
export class Select_Base_Component {
  public readonly options = optionsPreformatted;
}
