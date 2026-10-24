import { Component, signal } from '@angular/core';
import type { JigFilterProperty } from '@awdlab/jig/filter-builder';
import { JigFilterBar } from '@awdlab/jig/filter-bar';

import { people, ROLES, type Person } from '../../helper/people';

@Component({
  selector: 'jig-demo-filter-bar-properties',
  imports: [JigFilterBar],
  template: `
    <div class="flex flex-col gap-2" style="width: 420px; max-width: 100%">
      <jig-filter-bar
        [data]="people"
        [properties]="properties"
        (filterResultChange)="filtered.set($event)"
      />
      <ul class="text-sm">
        @for (person of filtered(); track person.id) {
          <li>{{ person.name }} · {{ person.email }} · {{ person.role }}</li>
        }
      </ul>
    </div>
  `,
})
export class Demo_FilterBar_Properties {
  protected readonly people = people;
  protected readonly properties: readonly JigFilterProperty<Person>[] = [
    { key: 'email', label: 'E-mail', dataType: 'string' },
    { key: 'role', label: 'Role', dataType: 'list', listOptions: ROLES },
    { key: 'joined', label: 'Joined', dataType: 'date' },
    { key: 'active', label: 'Active', dataType: 'boolean' },
  ];
  protected readonly filtered = signal<readonly Person[]>(people);
}
