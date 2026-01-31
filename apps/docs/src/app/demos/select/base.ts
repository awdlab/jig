import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSelect],
  selector: 'ngn-demo-select-base',
  template: `<ngn-select
    #select
    [options]="options"
    [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
  />`,
  host: { class: 'w-48' },
})
export class Demo_Select_Base {
  protected readonly options = exampleData.items.flatPreformatted;
}
