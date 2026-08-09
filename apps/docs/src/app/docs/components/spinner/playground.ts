import { Component, viewChild } from '@angular/core';
import { NgnSpinner } from '@awdlab/jig/spinner';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-spinner-playground',
  imports: [NgnSpinner, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnSpinner', component: component() }]">
      <awd-spinner #ref />
    </awd-docs-playground>
  `,
})
export class NgnDocsSpinnerPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSpinner });
}
