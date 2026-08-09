import { Component, viewChild } from '@angular/core';
import { JigFilter } from '@awdlab/jig/filter';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-filter-playground',
  imports: [JigFilter, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigFilter', component: component() }]">
      <jig-filter #ref [data]="data" />
    </jig-docs-playground>
  `,
})
export class JigDocsFilterPlayground {
  protected readonly component = viewChild.required('ref', { read: JigFilter });
  protected readonly data: readonly string[] = ['Germany', 'France', 'Italy', 'Spain', 'Sweden'];
}
