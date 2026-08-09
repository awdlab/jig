import { Component, viewChild } from '@angular/core';
import { AwdFilter } from '@awdlab/jig/filter';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-filter-playground',
  imports: [AwdFilter, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdFilter', component: component() }]">
      <jig-filter #ref [data]="data" />
    </jig-docs-playground>
  `,
})
export class AwdDocsFilterPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdFilter });
  protected readonly data: readonly string[] = ['Germany', 'France', 'Italy', 'Spain', 'Sweden'];
}
