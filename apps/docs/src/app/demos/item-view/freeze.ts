import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnItemView } from '@ngneers/controls/item-view';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnItemView, NgnTemplate],
  selector: 'ngn-demo-item-view-freeze',
  template: `
    <ngn-item-view
      #itemView
      [items]="items"
      [idField]="'id'"
      [overflowStrategyFreezeCount]="1"
      style="background: var(--ngn-color-surface-200);"
    >
      <ng-template #item [ngnTemplate]="itemView.templateTypes.item" let-item>
        <span style="padding: 4px; background: var(--ngn-color-surface-400);">
          {{ item.label }}
        </span>
      </ng-template>
    </ngn-item-view>
  `,
  host: { class: 'contents' },
})
export class Demo_ItemView_Freeze {
  protected readonly items = exampleData.items.flat.slice(0, 5);
}
