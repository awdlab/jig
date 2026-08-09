import { Component } from '@angular/core';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdSelect } from '@awdlab/jig/select';

import type { JigItem } from '@awdlab/jig/api';

@Component({
  imports: [AwdSelect, AwdInputField],
  selector: 'jig-demo-select-disabled-items',
  template: `<jig-input-field>
    <jig-select [options]="options" [popoverOptions]="{ sizeConstraints: { height: '200px' } }" />
  </jig-input-field>`,
  host: { class: 'w-48' },
})
export class Demo_Select_DisabledItems {
  protected readonly options: JigItem<unknown, string>[] = [
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr', disabled: true },
    { label: 'Spain', value: 'es' },
    { label: 'Italy', value: 'it', disabled: true },
    { label: 'United Kingdom', value: 'gb' },
    { label: 'Netherlands', value: 'nl' },
  ];
}
