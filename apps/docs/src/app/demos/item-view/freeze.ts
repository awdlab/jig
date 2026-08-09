import { Component } from '@angular/core';
import { AwdTemplate } from '@awdlab/jig/api/ng';
import { JigItemView } from '@awdlab/jig/item-view';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigItemView, AwdTemplate],
  selector: 'jig-demo-item-view-freeze',
  template: `
    <jig-item-view
      #itemView
      [items]="items"
      [idField]="'id'"
      [overflowStrategyFreezeCount]="1"
      style="background: var(--jig-color-surface-200);"
    >
      <ng-template #item [ngnTemplate]="itemView.templateTypes.item" let-item>
        <span style="padding: 4px; background: var(--jig-color-surface-400);">
          {{ item.label }}
        </span>
      </ng-template>
    </jig-item-view>
  `,
  host: { class: 'contents' },
})
export class Demo_ItemView_Freeze {
  protected readonly items = exampleData.items.flat.slice(0, 5);
}
