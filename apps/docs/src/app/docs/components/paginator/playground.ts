import { Component, viewChild } from '@angular/core';
import { NgnPaginator } from '@awdlab/jig/paginator';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-paginator-playground',
  imports: [NgnPaginator, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnPaginator', component: component() }]">
      <awd-paginator class="flex-1" #ref [totalItems]="50" />
    </awd-docs-playground>
  `,
})
export class NgnDocsPaginatorPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnPaginator });
}
