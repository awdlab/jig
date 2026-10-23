import { Component, computed, signal } from '@angular/core';
import { transformToJigItems } from '@awdlab/jig/api';
import type { JigAttributeFilterConfig, JigFilterAttribute } from '@awdlab/jig/attribute-filter';
import { JigFilterListBox } from '@awdlab/jig/filter-list-box';

import { people, ROLES, type Person } from '../../helper/people';

const items = transformToJigItems(people, { label: 'name', value: 'id' });
type Item = (typeof items)[number];

@Component({
  selector: 'jig-demo-filter-list-box-server-side',
  imports: [JigFilterListBox],
  template: `
    <div class="flex flex-col gap-2">
      <jig-filter-list-box
        label="Users"
        style="height: 320px; width: 380px; max-width: 100%"
        [items]="items"
        [attributes]="attributes"
        [filterLocally]="false"
        (filterChange)="config.set($event)"
      />
      <div class="text-sm opacity-70">
        The list stays untouched — the configuration is what you would send to your API:
      </div>
      <pre class="text-xs overflow-auto">{{ request() }}</pre>
    </div>
  `,
})
export class Demo_FilterListBox_ServerSide {
  protected readonly items = items;
  protected readonly attributes: readonly JigFilterAttribute<Item, Person>[] = [
    { key: 'email', label: 'E-mail', dataType: 'string' },
    { key: 'role', label: 'Role', dataType: 'list', listOptions: ROLES },
    { key: 'active', label: 'Active', dataType: 'boolean' },
  ];

  protected readonly config = signal<JigAttributeFilterConfig | null>(null);
  protected readonly request = computed(
    () => `POST /api/users/search\n${JSON.stringify(this.config(), null, 2)}`
  );
}
