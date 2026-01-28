import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnPaginator } from '@ngneers/controls/paginator';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnPaginator, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnPaginator" [component]="component()">
      <ngn-paginator #ref [totalItems]="50" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsPaginatorPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnPaginator });
}
