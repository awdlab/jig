import { Component } from '@angular/core';
import { AwdListBox } from '@awdlab/jig/list-box';

import { exampleData } from '../../helper/data';

@Component({
  imports: [AwdListBox],
  selector: 'jig-demo-list-box-templates-demo',
  template: `<jig-list-box [items]="items" style="display: block; height: 300px;">
    <ng-template #item let-option>
      <span>🏳️{{ option.label }}</span>
    </ng-template>
    <ng-template #group let-option>
      <span>🌍{{ option.label }}</span>
    </ng-template>
  </jig-list-box>`,
})
export class Demo_ListBox_Templates {
  protected readonly items = exampleData.items.groupedPreformatted;
}
