import { Component, viewChild } from '@angular/core';
import { JigPaginator } from '@awdlab/jig/paginator';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-paginator-playground',
  imports: [JigPaginator, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigPaginator', component: component() }]">
      <jig-paginator class="flex-1" #ref [totalItems]="50" />
    </jig-docs-playground>
  `,
})
export class JigDocsPaginatorPlayground {
  protected readonly component = viewChild.required('ref', { read: JigPaginator });
}
