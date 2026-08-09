import { Component, viewChild } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-button-playground',
  imports: [AwdButton, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdButton', component: component() }]">
      <button #ref ngnButton>
        @if (component().appliedKind() === 'icon') {
          👽
        } @else {
          A button
        }
      </button>
    </jig-docs-playground>
  `,
})
export class AwdDocsButtonPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdButton });
}
