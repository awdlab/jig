import { Component, viewChild } from '@angular/core';
import { AwdTemplate } from '@awdlab/jig/api/ng';
import { AwdInplace } from '@awdlab/jig/inplace';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-inplace-playground',
  imports: [AwdInplace, AwdTemplate, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdInplace', component: component() }]">
      <jig-inplace #ref>
        <ng-template #display>Show Details</ng-template>
        <ng-template #content [ngnTemplate]="component().templateTypes.content">
          <div>Content details here</div>
        </ng-template>
      </jig-inplace>
    </jig-docs-playground>
  `,
})
export class AwdDocsInplacePlayground {
  protected readonly component = viewChild.required('ref', { read: AwdInplace });
}
