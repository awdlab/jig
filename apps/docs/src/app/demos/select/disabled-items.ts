import { Component } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnSelect } from '@awdlab/jig/select';

import type { NgnItem } from '@awdlab/jig/api';

@Component({
  imports: [NgnSelect, NgnInputField],
  selector: 'awd-demo-select-disabled-items',
  template: `<awd-input-field>
    <awd-select [options]="options" [popoverOptions]="{ sizeConstraints: { height: '200px' } }" />
  </awd-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_DisabledItems {
  protected readonly options: NgnItem<unknown, string>[] = [
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr', disabled: true },
    { label: 'Spain', value: 'es' },
    { label: 'Italy', value: 'it', disabled: true },
    { label: 'United Kingdom', value: 'gb' },
    { label: 'Netherlands', value: 'nl' },
  ];
}
