import { Component, viewChild } from '@angular/core';
import { AwdTag } from '@awdlab/jig/tag';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-tag-playground',
  imports: [AwdTag, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdTag', component: component() }]">
      <jig-tag #ref>Tag</jig-tag>
    </jig-docs-playground>
  `,
})
export class AwdDocsTagPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdTag });
}
