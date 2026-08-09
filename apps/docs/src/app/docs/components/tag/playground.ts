import { Component, viewChild } from '@angular/core';
import { JigTag } from '@awdlab/jig/tag';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-tag-playground',
  imports: [JigTag, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigTag', component: component() }]">
      <jig-tag #ref>Tag</jig-tag>
    </jig-docs-playground>
  `,
})
export class JigDocsTagPlayground {
  protected readonly component = viewChild.required('ref', { read: JigTag });
}
