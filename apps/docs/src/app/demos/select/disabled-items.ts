import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';

import type { NgnItem } from '@ngneers/controls/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSelect, NgnInputField],
  selector: 'ngn-demo-select-disabled-items',
  template: `<ngn-input-field>
    <ngn-select [options]="options" [popoverOptions]="{ sizeConstraints: { height: '200px' } }" />
  </ngn-input-field>`,
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
