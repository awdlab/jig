import { Component, computed, signal } from '@angular/core';
import { JigAttributeFilter, type JigFilterAttribute } from '@awdlab/jig/attribute-filter';

import { type Person, people } from '../../helper/people';

@Component({
  selector: 'jig-demo-attribute-filter-inline',
  imports: [JigAttributeFilter],
  template: `
    <div class="flex flex-col gap-2">
      <jig-attribute-filter
        mode="inline"
        [data]="data"
        [attributes]="attributes"
        (filterResultChange)="filteredData.set($event)"
      />

      <div class="text-sm opacity-70">Showing {{ filtered().length }}/{{ data.length }} users</div>

      <ul class="list-disc ps-5">
        @for (person of filtered(); track person.id) {
          <li>{{ person.name }} · {{ person.email }} · #{{ person.id }}</li>
        }
      </ul>
    </div>
  `,
})
export class Demo_AttributeFilter_Inline {
  protected readonly data = people;
  protected readonly attributes: readonly JigFilterAttribute<Person>[] = [
    { key: 'name', label: 'Name', dataType: 'string' },
    { key: 'email', label: 'E-mail', dataType: 'string' },
    { key: 'id', label: 'ID', dataType: 'number' },
  ];

  protected readonly filteredData = signal<readonly Person[] | null>(null);
  protected readonly filtered = computed(() => this.filteredData() ?? this.data);
}
