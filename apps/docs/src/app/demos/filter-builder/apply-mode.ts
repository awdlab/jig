import { Component, computed, signal } from '@angular/core';
import { JigFilterBuilder, type JigFilterProperty } from '@awdlab/jig/filter-builder';

import { type Person, people } from '../../helper/people';

@Component({
  selector: 'jig-demo-filter-builder-apply-mode',
  imports: [JigFilterBuilder],
  template: `
    <div class="flex flex-col gap-2">
      <jig-filter-builder
        mode="inline"
        [allowMultiple]="true"
        [autoApply]="false"
        [data]="data"
        [properties]="properties"
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
export class Demo_FilterBuilder_ApplyMode {
  protected readonly data = people;
  protected readonly properties: readonly JigFilterProperty<Person>[] = [
    { key: 'name', label: 'Name', dataType: 'string' },
    { key: 'email', label: 'E-mail', dataType: 'string' },
    { key: 'id', label: 'ID', dataType: 'number' },
  ];

  protected readonly filteredData = signal<readonly Person[] | null>(null);
  protected readonly filtered = computed(() => this.filteredData() ?? this.data);
}
