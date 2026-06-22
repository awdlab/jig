import { Component, viewChild } from '@angular/core';
import { NgnPaginator } from '@ngneers/controls/paginator';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  imports: [NgnPaginator, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnPaginator', component: component() }]">
      <ngn-paginator class="flex-1" #ref [totalItems]="50" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsPaginatorPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnPaginator });
}
