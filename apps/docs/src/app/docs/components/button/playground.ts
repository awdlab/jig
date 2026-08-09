import { Component, viewChild } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-button-playground',
  imports: [NgnButton, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnButton', component: component() }]">
      <button #ref ngnButton>
        @if (component().appliedKind() === 'icon') {
          👽
        } @else {
          A button
        }
      </button>
    </awd-docs-playground>
  `,
})
export class NgnDocsButtonPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnButton });
}
