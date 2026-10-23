import { Component } from '@angular/core';
import { transformToJigItems } from '@awdlab/jig/api';
import type { JigFilterAttribute } from '@awdlab/jig/attribute-filter';
import { JigFilterListBox } from '@awdlab/jig/filter-list-box';

import { people, ROLES } from '../../helper/people';

const items = ROLES.map(role => ({
  label: role,
  value: role,
  items: transformToJigItems(
    people.filter(person => person.role === role),
    { label: 'name', value: 'id' }
  ),
}));

@Component({
  selector: 'jig-demo-filter-list-box-grouped',
  imports: [JigFilterListBox],
  template: `
    <jig-filter-list-box
      label="Users by role"
      style="height: 400px; width: 380px; max-width: 100%"
      [items]="items"
      [attributes]="attributes"
      [separator]="true"
    />
  `,
})
export class Demo_FilterListBox_Grouped {
  protected readonly items = items;
  protected readonly attributes: readonly JigFilterAttribute<(typeof items)[number]>[] = [
    { key: 'email', label: 'E-mail', dataType: 'string' },
    { key: 'active', label: 'Active', dataType: 'boolean' },
  ];
}
