import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSelect],
  selector: 'ngn-demo-select-multiple',
  template: `
    <ngn-select
      #select
      [multiple]="true"
      [filter]="true"
      [options]="options"
      (valueChange)="log($event)"
    />
  `,
  host: { class: 'w-48' },
})
export class Demo_Select_Multiple {
  protected readonly options = exampleData.items.groupedPreformatted;

  protected log(value: string[] | null) {
    console.log('Selected values:', value);
  }
}
