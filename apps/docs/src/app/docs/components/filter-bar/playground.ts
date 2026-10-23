import { Component, viewChild } from '@angular/core';
import { JigFilterBar } from '@awdlab/jig/filter-bar';
import type { JigFilterProperty } from '@awdlab/jig/filter-builder';

import { type Person, people, ROLES } from '../../../helper/people';
import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-filter-bar-playground',
  imports: [JigFilterBar, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigFilterBar', component: component() }]">
      <jig-filter-bar #ref [data]="data" [properties]="properties" />
    </jig-docs-playground>
  `,
})
export class JigDocsFilterBarPlayground {
  protected readonly component = viewChild.required('ref', { read: JigFilterBar });
  protected readonly data = people;
  protected readonly properties: readonly JigFilterProperty<Person>[] = [
    { key: 'name', label: 'Name', dataType: 'string' },
    { key: 'email', label: 'E-mail', dataType: 'string' },
    { key: 'role', label: 'Role', dataType: 'list', listOptions: ROLES },
  ];
}
