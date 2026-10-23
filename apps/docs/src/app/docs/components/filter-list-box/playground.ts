import { Component, viewChild } from '@angular/core';
import { transformToJigItems } from '@awdlab/jig/api';
import type { JigFilterAttribute } from '@awdlab/jig/attribute-filter';
import { JigFilterListBox } from '@awdlab/jig/filter-list-box';

import { people } from '../../../helper/people';
import { JigDocsPlayground } from '../../../utils/playground/playground';

const items = transformToJigItems(people, { label: 'name', value: 'id' });

@Component({
  selector: 'jig-docs-filter-list-box-playground',
  imports: [JigFilterListBox, JigDocsPlayground],
  template: `
    <jig-docs-playground
      [controls]="[{ componentName: 'JigFilterListBox', component: component() }]"
    >
      <jig-filter-list-box
        #ref
        class="flex-1"
        label="Users"
        style="height: 320px"
        [items]="items"
        [attributes]="attributes"
      />
    </jig-docs-playground>
  `,
})
export class JigDocsFilterListBoxPlayground {
  protected readonly component = viewChild.required('ref', { read: JigFilterListBox });
  protected readonly items = items;
  protected readonly attributes: readonly JigFilterAttribute<(typeof items)[number]>[] = [
    { key: 'email', label: 'E-mail', dataType: 'string' },
    { key: 'active', label: 'Active', dataType: 'boolean' },
  ];
}
