import { Component } from '@angular/core';
import { NgnListBox } from '@ngneers/controls/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnListBox],
  selector: 'ngn-list-box-templates',
  template: `<ngn-list-box [items]="items" style="display: block; height: 300px;">
    <ng-template #item let-option>
      <span>🏳️{{ option.label }}</span>
    </ng-template>
    <ng-template #group let-option>
      <span>🌍{{ option.label }}</span>
    </ng-template>
  </ngn-list-box>`,
})
export class Demo_ListBox_Templates {
  protected readonly items = exampleData.items.groupedPreformatted;
}
