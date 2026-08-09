import { Component, viewChild } from '@angular/core';
import { NgnState } from '@awdlab/jig/state';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-state-playground',
  imports: [NgnState, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnState', component: component() }]">
      <awd-state #ref kind="loading" />
    </awd-docs-playground>
  `,
})
export class NgnDocsStatePlayground {
  protected readonly component = viewChild.required('ref', { read: NgnState });
}
