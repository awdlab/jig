import { Component, signal } from '@angular/core';
import { transformToJigItems } from '@awdlab/jig/api';
import type { JigAttributeFilterConfig, JigFilterAttribute } from '@awdlab/jig/attribute-filter';
import { JigFilterListBox } from '@awdlab/jig/filter-list-box';

import { people, ROLES } from '../../helper/people';

const items = transformToJigItems(people, { label: 'name', value: 'id' });
type Item = (typeof items)[number];

@Component({
  selector: 'jig-demo-filter-list-box-attributes',
  imports: [JigFilterListBox],
  template: `
    <div class="flex flex-col gap-2">
      <jig-filter-list-box
        label="Users"
        style="height: 360px; width: 380px; max-width: 100%"
        [items]="items"
        [attributes]="attributes"
        (filterChange)="config.set($event)"
      />
      <div class="text-sm opacity-70">
        {{ config()?.conditions?.length ?? 0 }} condition(s) active
      </div>
    </div>
  `,
})
export class Demo_FilterListBox_Attributes {
  protected readonly items = items;
  protected readonly attributes: readonly JigFilterAttribute<Item>[] = [
    { key: 'email', label: 'E-mail', dataType: 'string' },
    { key: 'role', label: 'Role', dataType: 'list', listOptions: ROLES },
    { key: 'joined', label: 'Joined', dataType: 'date' },
    { key: 'active', label: 'Active', dataType: 'boolean' },
  ];

  protected readonly config = signal<JigAttributeFilterConfig | null>(null);
}
