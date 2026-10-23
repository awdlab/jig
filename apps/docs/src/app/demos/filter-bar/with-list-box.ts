import { Component, computed, signal } from '@angular/core';
import { executePropertyFilter, transformToJigItems } from '@awdlab/jig/api';
import { JigFilterBar } from '@awdlab/jig/filter-bar';
import type { JigFilterBuilderConfig, JigFilterProperty } from '@awdlab/jig/filter-builder';
import { JigListBox } from '@awdlab/jig/list-box';

import { people, ROLES, type Person } from '../../helper/people';

const items = transformToJigItems(people, { label: 'name', value: 'id' });

@Component({
  selector: 'jig-demo-filter-bar-with-list-box',
  imports: [JigFilterBar, JigListBox],
  template: `
    <div class="flex flex-col gap-2" style="width: 420px; max-width: 100%">
      <jig-filter-bar
        [data]="items"
        [properties]="properties"
        [filterLocally]="false"
        [(searchText)]="search"
        (filterChange)="config.set($event)"
      />
      <jig-list-box
        selectable
        label="Users"
        style="height: 260px"
        [items]="narrowed()"
        [filter]="true"
        [filterText]="search()"
      />
    </div>
  `,
})
export class Demo_FilterBar_WithListBox {
  protected readonly items = items;
  protected readonly search = signal('');
  protected readonly config = signal<JigFilterBuilderConfig | null>(null);
  protected readonly properties: readonly JigFilterProperty<(typeof items)[number], Person>[] = [
    { key: 'email', label: 'E-mail', dataType: 'string' },
    { key: 'role', label: 'Role', dataType: 'list', listOptions: ROLES },
  ];

  /** Conditions narrow the items; the list box matches the text itself. */
  protected readonly narrowed = computed(() => {
    const config = this.config();
    return config ? executePropertyFilter(items, config, this.properties, 'items') : items;
  });
}
