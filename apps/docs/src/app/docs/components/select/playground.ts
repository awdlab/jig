import { Component, viewChild } from '@angular/core';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdSelect } from '@awdlab/jig/select';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

import type { JigItem } from '@awdlab/jig/api';

@Component({
  selector: 'jig-docs-select-playground',
  imports: [AwdSelect, AwdInputField, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdSelect', component: component() }]">
      <jig-input-field>
        <jig-select #ref [options]="options" />
      </jig-input-field>
    </jig-docs-playground>
  `,
})
export class AwdDocsSelectPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdSelect });
  protected readonly options: JigItem[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];
}
