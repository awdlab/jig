import { Component, viewChild } from '@angular/core';
import { JigToggleButton } from '@awdlab/jig/toggle-button';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-toggle-button-playground',
  imports: [JigToggleButton, JigDocsPlayground],
  template: `
    <jig-docs-playground
      [controls]="[{ componentName: 'JigToggleButton', component: component() }]"
    >
      <jig-toggle-button #ref>Toggle Me</jig-toggle-button>
    </jig-docs-playground>
  `,
})
export class JigDocsToggleButtonPlayground {
  protected readonly component = viewChild.required('ref', { read: JigToggleButton });
}
