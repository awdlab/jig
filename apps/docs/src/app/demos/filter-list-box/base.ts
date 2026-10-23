import { Component, signal } from '@angular/core';
import { transformToJigItems } from '@awdlab/jig/api';
import { JigFilterListBox } from '@awdlab/jig/filter-list-box';

import { people } from '../../helper/people';

@Component({
  selector: 'jig-demo-filter-list-box-base',
  imports: [JigFilterListBox],
  template: `
    <div class="flex flex-col gap-2">
      <jig-filter-list-box
        label="Users"
        style="height: 320px; width: 380px; max-width: 100%"
        [items]="items"
        [(searchText)]="searchText"
      />
      <div class="text-sm opacity-70">Search text: "{{ searchText() }}"</div>
    </div>
  `,
})
export class Demo_FilterListBox_Base {
  protected readonly items = transformToJigItems(people, { label: 'name', value: 'id' });
  protected readonly searchText = signal('');
}
