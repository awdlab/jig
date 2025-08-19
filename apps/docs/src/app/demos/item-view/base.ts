import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnItemView } from '@ngneers/controls/item-view';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnItemView, NgnTemplate],
  selector: 'demo-item-view-base',
  template: `
    <ngn-item-view #itemView [items]="items">
      <ng-template #item [ngnTemplate]="itemView.templateTypes.item" let-item>
        <span style="padding: 4px; background: lightgray;">
          {{ item.label }}
        </span>
      </ng-template>
    </ngn-item-view>
  `,
})
export class Demo_ItemView_Base {
  protected readonly items = exampleData.items.flat.slice(0, 5);
}
