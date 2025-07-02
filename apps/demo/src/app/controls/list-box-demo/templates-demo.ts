import { Component } from '@angular/core';
import { ListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [ListBox],
  template: `<ngn-list-box [items]="items" style="display: block; height: 300px;">
    <ng-template #item let-option>
      <span>🏳️{{ option.label }}&ZeroWidthSpace;</span>
    </ng-template>
    <ng-template #group let-option>
      <span>🌍{{ option.label }}&ZeroWidthSpace;</span>
    </ng-template>
  </ngn-list-box>`,
})
export class ListBox_Templates_Component {
  public readonly items = exampleData.items.groupedPreformatted;
}
