import { Component, viewChild } from '@angular/core';
import { NgnToggleButton } from '@ngneers/controls/toggle-button';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  imports: [NgnToggleButton, NgnDocsPlayground],
  template: `
    <ngn-docs-playground
      [controls]="[{ componentName: 'NgnToggleButton', component: component() }]"
    >
      <ngn-toggle-button #ref>Toggle Me</ngn-toggle-button>
    </ngn-docs-playground>
  `,
})
export class NgnDocsToggleButtonPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnToggleButton });
}
