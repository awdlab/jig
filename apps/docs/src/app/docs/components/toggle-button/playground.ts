import { Component, viewChild } from '@angular/core';
import { NgnToggleButton } from '@awdlab/jig/toggle-button';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-toggle-button-playground',
  imports: [NgnToggleButton, NgnDocsPlayground],
  template: `
    <awd-docs-playground
      [controls]="[{ componentName: 'NgnToggleButton', component: component() }]"
    >
      <awd-toggle-button #ref>Toggle Me</awd-toggle-button>
    </awd-docs-playground>
  `,
})
export class NgnDocsToggleButtonPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnToggleButton });
}
