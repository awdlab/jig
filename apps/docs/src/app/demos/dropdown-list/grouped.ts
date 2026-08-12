import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigDropdownList } from '@awdlab/jig/dropdown-list';

import { exampleData } from '../../helper/data';

@Component({
  selector: 'jig-demo-dropdown-list-grouped',
  imports: [JigButton, JigDropdownList],
  template: `
    <button type="button" jigButton #trigger (click)="dropdown.toggle()">Grouped items</button>
    <jig-dropdown-list
      #dropdown
      [anchor]="trigger"
      label="Countries by continent"
      [items]="options"
      [separator]="true"
      [popoverOptions]="{ sizeConstraints: { width: 1, maxWidth: 1, maxHeight: '260px' } }"
    />
  `,
})
export class Demo_DropdownList_Grouped {
  protected readonly options = exampleData.items.groupedPreformatted;
}
