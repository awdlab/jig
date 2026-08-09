import { Component, viewChild } from '@angular/core';
import { NgnTemplate } from '@awdlab/jig/api/ng';
import { NgnInplace } from '@awdlab/jig/inplace';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-inplace-playground',
  imports: [NgnInplace, NgnTemplate, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnInplace', component: component() }]">
      <awd-inplace #ref>
        <ng-template #display>Show Details</ng-template>
        <ng-template #content [ngnTemplate]="component().templateTypes.content">
          <div>Content details here</div>
        </ng-template>
      </awd-inplace>
    </awd-docs-playground>
  `,
})
export class NgnDocsInplacePlayground {
  protected readonly component = viewChild.required('ref', { read: NgnInplace });
}
