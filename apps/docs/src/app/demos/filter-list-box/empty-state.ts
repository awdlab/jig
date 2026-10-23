import { Component, signal } from '@angular/core';
import { transformToJigItems } from '@awdlab/jig/api';
import type { JigFilterAttribute } from '@awdlab/jig/attribute-filter';
import { JigFilterListBox } from '@awdlab/jig/filter-list-box';

import { people } from '../../helper/people';

const items = transformToJigItems(people, { label: 'name', value: 'id' });
type Item = (typeof items)[number];

@Component({
  selector: 'jig-demo-filter-list-box-empty-state',
  imports: [JigFilterListBox],
  template: `
    <jig-filter-list-box
      label="Users"
      style="height: 320px; width: 380px; max-width: 100%"
      [items]="items"
      [attributes]="attributes"
      [(searchText)]="searchText"
    />
  `,
})
export class Demo_FilterListBox_EmptyState {
  protected readonly items = items;
  protected readonly attributes: readonly JigFilterAttribute<Item>[] = [
    { key: 'email', label: 'E-mail', dataType: 'string' },
    { key: 'active', label: 'Active', dataType: 'boolean' },
  ];

  protected readonly searchText = signal('Zoltan');
}
