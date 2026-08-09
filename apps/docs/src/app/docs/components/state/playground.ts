import { Component, viewChild } from '@angular/core';
import { JigState } from '@awdlab/jig/state';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-state-playground',
  imports: [JigState, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigState', component: component() }]">
      <jig-state #ref kind="loading" />
    </jig-docs-playground>
  `,
})
export class JigDocsStatePlayground {
  protected readonly component = viewChild.required('ref', { read: JigState });
}
