import { Component, viewChild } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnSelect } from '@awdlab/jig/select';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

import type { NgnItem } from '@awdlab/jig/api';

@Component({
  selector: 'awd-docs-select-playground',
  imports: [NgnSelect, NgnInputField, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnSelect', component: component() }]">
      <awd-input-field>
        <awd-select #ref [options]="options" />
      </awd-input-field>
    </awd-docs-playground>
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
