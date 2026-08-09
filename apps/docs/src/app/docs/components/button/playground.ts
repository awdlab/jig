import { Component, viewChild } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-button-playground',
  imports: [JigButton, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigButton', component: component() }]">
      <button #ref jigButton>
        @if (component().appliedKind() === 'icon') {
          👽
        } @else {
          A button
        }
      </button>
    </jig-docs-playground>
  `,
})
export class JigDocsButtonPlayground {
  protected readonly component = viewChild.required('ref', { read: JigButton });
}
