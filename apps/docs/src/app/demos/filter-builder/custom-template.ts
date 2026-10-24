import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import {
  JigFilterBuilder,
  type JigFilterBuilderConfig,
  type JigFilterProperty,
} from '@awdlab/jig/filter-builder';

import { people, type Person } from '../../helper/people';

type Preset = { label: string; config: JigFilterBuilderConfig };

const PRESETS: readonly Preset[] = [
  {
    label: 'Gmail users',
    config: {
      matchMode: 'all',
      conditions: [{ property: 'email', operator: 'contains', rawValue: '@gmail.com' }],
    },
  },
  {
    label: 'Admins',
    config: {
      matchMode: 'all',
      conditions: [{ property: 'role', operator: 'isEqual', rawValue: 'Admin' }],
    },
  },
  {
    label: 'Inactive',
    config: {
      matchMode: 'all',
      conditions: [{ property: 'active', operator: 'isFalse', rawValue: null }],
    },
  },
];

@Component({
  selector: 'jig-demo-filter-builder-custom-template',
  imports: [JigFilterBuilder, JigButton],
  template: `
    <div class="flex flex-col gap-2" style="width: 320px; max-width: 100%">
      <jig-filter-builder
        mode="inline"
        [data]="people"
        [properties]="properties"
        (filterResultChange)="filtered.set($event)"
      >
        <ng-template #filter let-setValue="setValue">
          <div class="flex flex-wrap gap-2" style="padding: 0.5rem">
            @for (preset of presets; track preset.label) {
              <button type="button" jigButton kind="secondary" (click)="setValue(preset.config)">
                {{ preset.label }}
              </button>
            }
          </div>
        </ng-template>
      </jig-filter-builder>
      <div class="text-sm opacity-70">{{ filtered().length }} of {{ people.length }} people</div>
    </div>
  `,
})
export class Demo_FilterBuilder_CustomTemplate {
  protected readonly people = people;
  protected readonly presets = PRESETS;
  protected readonly filtered = signal<readonly Person[]>(people);
  protected readonly properties: readonly JigFilterProperty<Person>[] = [
    { key: 'email', label: 'E-mail', dataType: 'string' },
    { key: 'role', label: 'Role', dataType: 'string' },
    { key: 'active', label: 'Active', dataType: 'boolean' },
  ];
}
