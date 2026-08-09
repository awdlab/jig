import { Component, viewChild } from '@angular/core';
import { NgnTag } from '@awdlab/jig/tag';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-tag-playground',
  imports: [NgnTag, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnTag', component: component() }]">
      <awd-tag #ref>Tag</awd-tag>
    </awd-docs-playground>
  `,
})
export class NgnDocsTagPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnTag });
}
