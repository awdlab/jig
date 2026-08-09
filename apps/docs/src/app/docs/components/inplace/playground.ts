import { Component, viewChild } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigInplace } from '@awdlab/jig/inplace';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-inplace-playground',
  imports: [JigInplace, JigTemplate, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigInplace', component: component() }]">
      <jig-inplace #ref>
        <ng-template #display>Show Details</ng-template>
        <ng-template #content [ngnTemplate]="component().templateTypes.content">
          <div>Content details here</div>
        </ng-template>
      </jig-inplace>
    </jig-docs-playground>
  `,
})
export class JigDocsInplacePlayground {
  protected readonly component = viewChild.required('ref', { read: JigInplace });
}
