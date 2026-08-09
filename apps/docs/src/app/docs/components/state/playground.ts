import { Component, viewChild } from '@angular/core';
import { AwdState } from '@awdlab/jig/state';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-state-playground',
  imports: [AwdState, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdState', component: component() }]">
      <jig-state #ref kind="loading" />
    </jig-docs-playground>
  `,
})
export class AwdDocsStatePlayground {
  protected readonly component = viewChild.required('ref', { read: AwdState });
}
