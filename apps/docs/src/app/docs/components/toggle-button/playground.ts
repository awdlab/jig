import { Component, viewChild } from '@angular/core';
import { AwdToggleButton } from '@awdlab/jig/toggle-button';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-toggle-button-playground',
  imports: [AwdToggleButton, AwdDocsPlayground],
  template: `
    <jig-docs-playground
      [controls]="[{ componentName: 'AwdToggleButton', component: component() }]"
    >
      <jig-toggle-button #ref>Toggle Me</jig-toggle-button>
    </jig-docs-playground>
  `,
})
export class AwdDocsToggleButtonPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdToggleButton });
}
