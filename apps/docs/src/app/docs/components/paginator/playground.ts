import { Component, viewChild } from '@angular/core';
import { AwdPaginator } from '@awdlab/jig/paginator';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-paginator-playground',
  imports: [AwdPaginator, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdPaginator', component: component() }]">
      <jig-paginator class="flex-1" #ref [totalItems]="50" />
    </jig-docs-playground>
  `,
})
export class AwdDocsPaginatorPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdPaginator });
}
