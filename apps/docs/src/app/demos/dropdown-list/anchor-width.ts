import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigDropdownList } from '@awdlab/jig/dropdown-list';
import { JigIcon } from '@awdlab/jig/icon';

import { exampleData } from '../../helper/data';

@Component({
  selector: 'jig-demo-dropdown-list-anchor-width',
  imports: [JigButton, JigDropdownList, JigIcon],
  template: `
    <div class="flex items-start gap-8">
      <div>
        <button type="button" jigButton #wide (click)="matched.toggle()">
          Matches this button's width
        </button>
        <jig-dropdown-list
          #matched
          [anchor]="wide"
          label="Matched width"
          [items]="options"
          [popoverOptions]="{ sizeConstraints: { width: 1, maxWidth: 1, maxHeight: '260px' } }"
        />
      </div>

      <div>
        <button type="button" jigButton kind="icon" #slim (click)="anchored.toggle()">
          <jig-icon defaultIcon="dropdown-toggle" />
        </button>
        <jig-dropdown-list
          #anchored
          [anchor]="slim"
          label="Anchored width"
          [items]="options"
          [popoverOptions]="{ sizeConstraints: { maxHeight: '260px' } }"
        />
      </div>
    </div>
  `,
})
export class Demo_DropdownList_AnchorWidth {
  protected readonly options = exampleData.items.flatPreformatted;
}
