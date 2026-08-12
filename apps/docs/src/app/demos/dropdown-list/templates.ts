import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigDropdownList } from '@awdlab/jig/dropdown-list';
import { JigTemplate } from '@awdlab/jig/api/ng';

import { exampleData } from '../../helper/data';

@Component({
  selector: 'jig-demo-dropdown-list-templates',
  imports: [JigButton, JigDropdownList, JigTemplate],
  template: `
    <button type="button" jigButton #trigger (click)="dropdown.toggle()">Custom items</button>
    <jig-dropdown-list
      #dropdown
      [anchor]="trigger"
      label="Countries"
      [items]="options"
      [popoverOptions]="{ sizeConstraints: { width: 1, maxWidth: 1, maxHeight: '260px' } }"
    >
      <span dropdownHeader class="block px-3 py-2 text-sm opacity-70">Pick a country</span>

      <ng-template #item let-item [jigTemplate]="dropdown.templateTypes.item">
        <span class="flex items-center gap-2">
          <span class="font-mono text-xs opacity-60">{{ item?.value }}</span>
          <span>{{ item?.label }}</span>
        </span>
      </ng-template>
    </jig-dropdown-list>
  `,
})
export class Demo_DropdownList_Templates {
  protected readonly options = exampleData.items.flatPreformatted;
}
