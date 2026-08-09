import { Component, viewChild } from '@angular/core';
import { JigSpinner } from '@awdlab/jig/spinner';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-spinner-playground',
  imports: [JigSpinner, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigSpinner', component: component() }]">
      <jig-spinner #ref />
    </jig-docs-playground>
  `,
})
export class JigDocsSpinnerPlayground {
  protected readonly component = viewChild.required('ref', { read: JigSpinner });
}
