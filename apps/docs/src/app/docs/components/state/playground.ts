import { Component, viewChild } from '@angular/core';
import { NgnState } from '@ngneers/controls/state';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  imports: [NgnState, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnState', component: component() }]">
      <ngn-state #ref kind="loading" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsStatePlayground {
  protected readonly component = viewChild.required('ref', { read: NgnState });
}
