import { Component, viewChild } from '@angular/core';
import { NgnSelectButton } from '@awdlab/jig/select-button';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-select-button-playground',
  imports: [NgnSelectButton, NgnDocsPlayground],
  template: `
    <awd-docs-playground
      [controls]="[{ componentName: 'NgnSelectButton', component: component() }]"
    >
      <awd-select-button #ref [options]="options" />
    </awd-docs-playground>
  `,
})
export class NgnDocsSelectButtonPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSelectButton });
  protected readonly options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ] as const;
}
