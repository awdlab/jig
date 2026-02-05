import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnSelect } from '@ngneers/controls/select';

import { exampleData } from '../../helper/data';

import type { PopoverOptions } from '@ngneers/controls/popover';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSelect],
  selector: 'ngn-demo-select-states',
  template: `
    Default:
    <ngn-select [options]="options" [popoverOptions]="popoverOptions" />
    Readonly:
    <ngn-select [options]="options" [popoverOptions]="popoverOptions" readonly />
    Disabled:
    <ngn-select [options]="options" [popoverOptions]="popoverOptions" disabled />
    Invalid:
    <ngn-select [options]="options" [popoverOptions]="popoverOptions" invalid />
    Invalid + Readonly:
    <ngn-select [options]="options" [popoverOptions]="popoverOptions" invalid readonly />
    Invalid + Disabled:
    <ngn-select [options]="options" [popoverOptions]="popoverOptions" invalid disabled />
  `,
  host: { class: 'w-48' },
})
export class Demo_Select_States {
  protected readonly options = exampleData.items.flatPreformatted;
  protected readonly popoverOptions: PopoverOptions = { sizeConstraints: { maxHeight: '200px' } };
}
