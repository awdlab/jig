import { Component, signal } from '@angular/core';
import { JigFilterBar } from '@awdlab/jig/filter-bar';

import { people, type Person } from '../../helper/people';

@Component({
  selector: 'jig-demo-filter-bar-base',
  imports: [JigFilterBar],
  template: `
    <div class="flex flex-col gap-2" style="width: 420px; max-width: 100%">
      <jig-filter-bar [data]="people" (filterResultChange)="filtered.set($event)" />
      <div class="text-sm opacity-70">{{ filtered().length }} of {{ people.length }} people</div>
    </div>
  `,
})
export class Demo_FilterBar_Base {
  protected readonly people = people;
  protected readonly filtered = signal<readonly Person[]>(people);
}
