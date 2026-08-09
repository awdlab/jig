import { Component, viewChild } from '@angular/core';
import { JigSelectButton } from '@awdlab/jig/select-button';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-select-button-playground',
  imports: [JigSelectButton, JigDocsPlayground],
  template: `
    <jig-docs-playground
      [controls]="[{ componentName: 'JigSelectButton', component: component() }]"
    >
      <jig-select-button #ref [options]="options" />
    </jig-docs-playground>
  `,
})
export class JigDocsSelectButtonPlayground {
  protected readonly component = viewChild.required('ref', { read: JigSelectButton });
  protected readonly options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ] as const;
}
