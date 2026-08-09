import { Component, viewChild } from '@angular/core';
import { AwdSpinner } from '@awdlab/jig/spinner';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-spinner-playground',
  imports: [AwdSpinner, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdSpinner', component: component() }]">
      <jig-spinner #ref />
    </jig-docs-playground>
  `,
})
export class AwdDocsSpinnerPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdSpinner });
}
