import { Component, viewChild } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSelect } from '@awdlab/jig/select';

import { JigDocsPlayground } from '../../../utils/playground/playground';

import type { JigItem } from '@awdlab/jig/api';

@Component({
  selector: 'jig-docs-select-playground',
  imports: [JigSelect, JigInputField, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigSelect', component: component() }]">
      <jig-input-field>
        <jig-select #ref [options]="options" />
      </jig-input-field>
    </jig-docs-playground>
  `,
})
export class JigDocsSelectPlayground {
  protected readonly component = viewChild.required('ref', { read: JigSelect });
  protected readonly options: JigItem[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];
}
