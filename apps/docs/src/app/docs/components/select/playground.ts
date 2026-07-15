import { Component, viewChild } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

import type { NgnItem } from '@ngneers/controls/api';

@Component({
  selector: 'ngn-docs-select-playground',
  imports: [NgnSelect, NgnInputField, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnSelect', component: component() }]">
      <ngn-input-field>
        <ngn-select #ref [options]="options" />
      </ngn-input-field>
    </ngn-docs-playground>
  `,
})
export class NgnDocsSelectPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSelect });
  protected readonly options: NgnItem[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];
}
