import { Component, viewChild } from '@angular/core';
import { NgnTag } from '@ngneers/controls/tag';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-tag-playground',
  imports: [NgnTag, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnTag', component: component() }]">
      <ngn-tag #ref>Tag</ngn-tag>
    </ngn-docs-playground>
  `,
})
export class NgnDocsTagPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnTag });
}
