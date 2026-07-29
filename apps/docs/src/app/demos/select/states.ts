import { Component } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

import type { PopoverOptions } from '@ngneers/controls/popover';

@Component({
  imports: [NgnSelect, NgnInputField],
  selector: 'ngn-demo-select-states',
  template: `
    Default:
    <ngn-input-field>
      <ngn-select [options]="options" [popoverOptions]="popoverOptions" />
    </ngn-input-field>
    Readonly:
    <ngn-input-field>
      <ngn-select [options]="options" [popoverOptions]="popoverOptions" readonly />
    </ngn-input-field>
    Disabled:
    <ngn-input-field>
      <ngn-select [options]="options" [popoverOptions]="popoverOptions" disabled />
    </ngn-input-field>
    Invalid:
    <ngn-input-field>
      <ngn-select
        [options]="options"
        [popoverOptions]="popoverOptions"
        [invalidOn]="'immediate'"
        invalid
      />
    </ngn-input-field>
    Invalid + Readonly:
    <ngn-input-field>
      <ngn-select
        [options]="options"
        [popoverOptions]="popoverOptions"
        [invalidOn]="'immediate'"
        invalid
        readonly
      />
    </ngn-input-field>
    Invalid + Disabled:
    <ngn-input-field>
      <ngn-select
        [options]="options"
        [popoverOptions]="popoverOptions"
        [invalidOn]="'immediate'"
        invalid
        disabled
      />
    </ngn-input-field>
  `,
  host: { class: 'w-48' },
})
export class Demo_Select_States {
  protected readonly options = exampleData.items.flatPreformatted;
  protected readonly popoverOptions: PopoverOptions = { sizeConstraints: { maxHeight: '200px' } };
}
