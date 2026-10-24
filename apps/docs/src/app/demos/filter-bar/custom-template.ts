import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigFilterBar } from '@awdlab/jig/filter-bar';
import type { JigFilterBuilderConfig, JigFilterProperty } from '@awdlab/jig/filter-builder';

import { people, ROLES, type Person } from '../../helper/people';

@Component({
  selector: 'jig-demo-filter-bar-custom-template',
  imports: [JigFilterBar, JigButton],
  template: `
    <div class="flex flex-col gap-2" style="width: 420px; max-width: 100%">
      <jig-filter-bar
        [data]="people"
        [properties]="properties"
        (filterResultChange)="filtered.set($event)"
      >
        <ng-template #filter let-setValue="setValue" let-clear="clear">
          <div class="flex flex-col gap-2" style="padding: 0.5rem; min-width: 200px">
            @for (role of roles; track role) {
              <button type="button" jigButton kind="secondary" (click)="pick(role, setValue)">
                {{ role }}s only
              </button>
            }
            <button type="button" jigButton kind="text" (click)="clear()">Any role</button>
          </div>
        </ng-template>
      </jig-filter-bar>
      <ul class="text-sm">
        @for (person of filtered(); track person.id) {
          <li>{{ person.name }} · {{ person.role }}</li>
        }
      </ul>
    </div>
  `,
})
export class Demo_FilterBar_CustomTemplate {
  protected readonly people = people;
  protected readonly roles = ROLES;
  protected readonly filtered = signal<readonly Person[]>(people);
  protected readonly properties: readonly JigFilterProperty<Person>[] = [
    // Declared as a string so an exact `isEqual` match is a valid operator for it.
    { key: 'role', label: 'Role', dataType: 'string' },
  ];

  /** The popover is ours, but it writes the configuration the bar already understands. */
  protected pick(
    role: Person['role'],
    setValue: (config: JigFilterBuilderConfig | null) => void
  ): void {
    setValue({
      matchMode: 'all',
      conditions: [{ property: 'role', operator: 'isEqual', rawValue: role }],
    });
  }
}
