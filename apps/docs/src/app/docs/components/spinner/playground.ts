import { Component, viewChild } from '@angular/core';
import { NgnSpinner } from '@ngneers/controls/spinner';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  imports: [NgnSpinner, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnSpinner', component: component() }]">
      <ngn-spinner #ref />
    </ngn-docs-playground>
  `,
})
export class NgnDocsSpinnerPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSpinner });
}
