import { Component } from '@angular/core';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

@Component({
  imports: [AwdSelect, AwdInputField],
  selector: 'jig-demo-select-base',
  template: `<jig-input-field>
    <jig-select
      #select
      [options]="options"
      [popoverOptions]="{ sizeConstraints: { height: '200px' } }"
    />
  </jig-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_Base {
  protected readonly options = exampleData.items.flatPreformatted;
}
