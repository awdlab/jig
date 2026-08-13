import { Component, viewChild } from '@angular/core';
import { JigSkeleton } from '@awdlab/jig/skeleton';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-skeleton-playground',
  imports: [JigSkeleton, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigSkeleton', component: component() }]">
      <jig-skeleton #ref [width]="240" [height]="24" />
    </jig-docs-playground>
  `,
})
export class JigDocsSkeletonPlayground {
  protected readonly component = viewChild.required('ref', { read: JigSkeleton });
}
