import { Component, viewChild } from '@angular/core';
import { NgnFilter } from '@awdlab/jig/filter';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-filter-playground',
  imports: [NgnFilter, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnFilter', component: component() }]">
      <awd-filter #ref [data]="data" />
    </awd-docs-playground>
  `,
})
export class NgnDocsFilterPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnFilter });
  protected readonly data: readonly string[] = ['Germany', 'France', 'Italy', 'Spain', 'Sweden'];
}
