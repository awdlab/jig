import { Component, viewChild } from '@angular/core';
import { JigFilterField } from '@awdlab/jig/filter-field';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-filter-playground',
  imports: [JigFilterField, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigFilterField', component: component() }]">
      <jig-filter-field #ref [data]="data" />
    </jig-docs-playground>
  `,
})
export class JigDocsFilterFieldPlayground {
  protected readonly component = viewChild.required('ref', { read: JigFilterField });
  protected readonly data: readonly string[] = ['Germany', 'France', 'Italy', 'Spain', 'Sweden'];
}
