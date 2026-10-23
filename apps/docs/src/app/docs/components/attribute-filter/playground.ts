import { Component, viewChild } from '@angular/core';
import { JigAttributeFilter, type JigFilterAttribute } from '@awdlab/jig/attribute-filter';

import { type Person, people } from '../../../helper/people';
import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-attribute-filter-playground',
  imports: [JigAttributeFilter, JigDocsPlayground],
  template: `
    <jig-docs-playground
      [controls]="[{ componentName: 'JigAttributeFilter', component: component() }]"
    >
      <jig-attribute-filter #ref [data]="data" [attributes]="attributes" />
    </jig-docs-playground>
  `,
})
export class JigDocsAttributeFilterPlayground {
  protected readonly component = viewChild.required('ref', { read: JigAttributeFilter });
  protected readonly data = people;
  protected readonly attributes: readonly JigFilterAttribute<Person>[] = [
    { key: 'name', label: 'Name', dataType: 'string' },
    { key: 'email', label: 'E-mail', dataType: 'string' },
    { key: 'id', label: 'ID', dataType: 'number' },
  ];
}
