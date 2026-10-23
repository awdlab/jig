import { Component, viewChild } from '@angular/core';
import { JigFilterBuilder, type JigFilterProperty } from '@awdlab/jig/filter-builder';

import { type Person, people } from '../../../helper/people';
import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-filter-builder-playground',
  imports: [JigFilterBuilder, JigDocsPlayground],
  template: `
    <jig-docs-playground
      [controls]="[{ componentName: 'JigFilterBuilder', component: component() }]"
    >
      <jig-filter-builder #ref [data]="data" [properties]="properties" />
    </jig-docs-playground>
  `,
})
export class JigDocsFilterBuilderPlayground {
  protected readonly component = viewChild.required('ref', { read: JigFilterBuilder });
  protected readonly data = people;
  protected readonly properties: readonly JigFilterProperty<Person>[] = [
    { key: 'name', label: 'Name', dataType: 'string' },
    { key: 'email', label: 'E-mail', dataType: 'string' },
    { key: 'id', label: 'ID', dataType: 'number' },
  ];
}
