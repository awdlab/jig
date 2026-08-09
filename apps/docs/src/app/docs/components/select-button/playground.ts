import { Component, viewChild } from '@angular/core';
import { AwdSelectButton } from '@awdlab/jig/select-button';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-select-button-playground',
  imports: [AwdSelectButton, AwdDocsPlayground],
  template: `
    <jig-docs-playground
      [controls]="[{ componentName: 'AwdSelectButton', component: component() }]"
    >
      <jig-select-button #ref [options]="options" />
    </jig-docs-playground>
  `,
})
export class AwdDocsSelectButtonPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdSelectButton });
  protected readonly options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ] as const;
}
