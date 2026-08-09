import { Component } from '@angular/core';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

import type { PopoverOptions } from '@awdlab/jig/popover';

@Component({
  imports: [AwdSelect, AwdInputField],
  selector: 'jig-demo-select-states',
  template: `
    Default:
    <jig-input-field>
      <jig-select [options]="options" [popoverOptions]="popoverOptions" />
    </jig-input-field>
    Readonly:
    <jig-input-field>
      <jig-select [options]="options" [popoverOptions]="popoverOptions" readonly />
    </jig-input-field>
    Disabled:
    <jig-input-field>
      <jig-select [options]="options" [popoverOptions]="popoverOptions" disabled />
    </jig-input-field>
    Invalid:
    <jig-input-field>
      <jig-select
        [options]="options"
        [popoverOptions]="popoverOptions"
        [invalidOn]="'immediate'"
        invalid
      />
    </jig-input-field>
    Invalid + Readonly:
    <jig-input-field>
      <jig-select
        [options]="options"
        [popoverOptions]="popoverOptions"
        [invalidOn]="'immediate'"
        invalid
        readonly
      />
    </jig-input-field>
    Invalid + Disabled:
    <jig-input-field>
      <jig-select
        [options]="options"
        [popoverOptions]="popoverOptions"
        [invalidOn]="'immediate'"
        invalid
        disabled
      />
    </jig-input-field>
  `,
  host: { class: 'w-48' },
})
export class Demo_Select_States {
  protected readonly options = exampleData.items.flatPreformatted;
  protected readonly popoverOptions: PopoverOptions = { sizeConstraints: { maxHeight: '200px' } };
}
