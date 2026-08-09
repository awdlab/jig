import { Component } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnSelect } from '@awdlab/jig/select';

import { exampleData } from '../../helper/data';

import type { PopoverOptions } from '@awdlab/jig/popover';

@Component({
  imports: [NgnSelect, NgnInputField],
  selector: 'awd-demo-select-states',
  template: `
    Default:
    <awd-input-field>
      <awd-select [options]="options" [popoverOptions]="popoverOptions" />
    </awd-input-field>
    Readonly:
    <awd-input-field>
      <awd-select [options]="options" [popoverOptions]="popoverOptions" readonly />
    </awd-input-field>
    Disabled:
    <awd-input-field>
      <awd-select [options]="options" [popoverOptions]="popoverOptions" disabled />
    </awd-input-field>
    Invalid:
    <awd-input-field>
      <awd-select
        [options]="options"
        [popoverOptions]="popoverOptions"
        [invalidOn]="'immediate'"
        invalid
      />
    </awd-input-field>
    Invalid + Readonly:
    <awd-input-field>
      <awd-select
        [options]="options"
        [popoverOptions]="popoverOptions"
        [invalidOn]="'immediate'"
        invalid
        readonly
      />
    </awd-input-field>
    Invalid + Disabled:
    <awd-input-field>
      <awd-select
        [options]="options"
        [popoverOptions]="popoverOptions"
        [invalidOn]="'immediate'"
        invalid
        disabled
      />
    </awd-input-field>
  `,
  host: { class: 'w-48' },
})
export class Demo_Select_States {
  protected readonly options = exampleData.items.flatPreformatted;
  protected readonly popoverOptions: PopoverOptions = { sizeConstraints: { maxHeight: '200px' } };
}
