import { Component, computed, signal } from '@angular/core';
import { JigAttributeFilter, type JigFilterAttribute } from '@awdlab/jig/attribute-filter';

import { type Person, people, ROLES } from '../../helper/people';

@Component({
  selector: 'jig-demo-attribute-filter-datatypes',
  imports: [JigAttributeFilter],
  template: `
    <div class="flex flex-col gap-2">
      <jig-attribute-filter
        mode="inline"
        [allowMultiple]="true"
        [data]="data"
        [attributes]="attributes"
        (filterResultChange)="filteredData.set($event)"
      />

      <div class="text-sm opacity-70">Showing {{ filtered().length }}/{{ data.length }} users</div>

      <ul class="list-disc ps-5">
        @for (person of filtered(); track person.id) {
          <li>
            {{ person.name }} · {{ person.role }} · joined
            {{ person.joined.toLocaleDateString() }} · {{ person.active ? 'active' : 'inactive' }}
          </li>
        }
      </ul>
    </div>
  `,
})
export class Demo_AttributeFilter_DataTypes {
  protected readonly data = people;
  protected readonly attributes: readonly JigFilterAttribute<Person>[] = [
    { key: 'name', label: 'Name', dataType: 'string' },
    { key: 'id', label: 'ID', dataType: 'number' },
    { key: 'role', label: 'Role', dataType: 'list', listOptions: ROLES },
    { key: 'joined', label: 'Joined', dataType: 'date' },
    { key: 'lastSeen', label: 'Last seen', dataType: 'dateTime' },
    { key: 'active', label: 'Active', dataType: 'boolean' },
    {
      key: 'search',
      label: 'Any field',
      dataType: 'custom',
      selector: person => `${person.name} ${person.email} ${person.role}`,
    },
  ];

  protected readonly filteredData = signal<readonly Person[] | null>(null);
  protected readonly filtered = computed(() => this.filteredData() ?? this.data);
}
