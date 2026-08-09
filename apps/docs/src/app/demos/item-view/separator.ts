import { Component } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigItemView } from '@awdlab/jig/item-view';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigItemView, JigTemplate],
  selector: 'jig-demo-item-view-separator',
  template: `
    <jig-item-view
      #itemView
      [items]="items"
      [idField]="'id'"
      [separator]="'|'"
      [overflowStrategy]="'end'"
      [overflowStrategyFreezeCount]="1"
      [overflowStrategyIndex]="2"
      style="background: var(--jig-color-surface-200);"
    >
      <ng-template #item [jigTemplate]="itemView.templateTypes.item" let-item>
        <span style="padding: 4px; background: var(--jig-color-surface-400);">
          {{ item.label }}
        </span>
      </ng-template>
      <ng-template #separator [jigTemplate]="itemView.templateTypes.separator" let-separator>
        <span style="padding: 4px; background: var(--jig-color-surface-300);">
          {{ separator.character }}
        </span>
      </ng-template>
    </jig-item-view>
  `,
  host: { class: 'contents' },
})
export class Demo_ItemView_Separator {
  protected readonly items = exampleData.items.flat.slice(0, 5);
}
