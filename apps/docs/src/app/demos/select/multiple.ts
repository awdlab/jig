import { Component } from '@angular/core';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnSelect],
  selector: 'ngn-select-multiple',
  template: `
    <ngn-select
      #select
      [multiple]="true"
      [filter]="true"
      [options]="options"
      (valueChange)="log($event)"
    />
  `,
})
export class Demo_Select_Multiple {
  protected readonly options = exampleData.items.groupedPreformatted;

  protected log(value: any) {
    console.log('Selected values:', value);
  }
}
