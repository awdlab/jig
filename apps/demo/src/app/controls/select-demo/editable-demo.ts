import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect, FormsModule],
  selector: 'ngn-select-editable',
  template: `<ngn-select
    #select
    [options]="options"
    [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
    [editable]="true"
    [ngModel]="''"
    (ngModelChange)="changed($event)"
    style="width: 200px"
  />`,
})
export class Select_Editable_Component {
  protected readonly options = exampleData.items.flatPreformatted;

  protected changed(value: string) {
    console.log('Selected value:', value);
  }
}
