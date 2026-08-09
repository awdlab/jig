import { Component } from '@angular/core';
import { NgnTemplate } from '@awdlab/jig/api/ng';
import { NgnItemView } from '@awdlab/jig/item-view';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnItemView, NgnTemplate],
  selector: 'awd-demo-item-view-freeze',
  template: `
    <awd-item-view
      #itemView
      [items]="items"
      [idField]="'id'"
      [overflowStrategyFreezeCount]="1"
      style="background: var(--awd-color-surface-200);"
    >
      <ng-template #item [ngnTemplate]="itemView.templateTypes.item" let-item>
        <span style="padding: 4px; background: var(--awd-color-surface-400);">
          {{ item.label }}
        </span>
      </ng-template>
    </awd-item-view>
  `,
  host: { class: 'contents' },
})
export class Demo_ItemView_Freeze {
  protected readonly items = exampleData.items.flat.slice(0, 5);
}
