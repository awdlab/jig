import { Component } from '@angular/core';
import { NgnTemplate } from '@awdlab/jig/api/ng';
import { NgnItemView } from '@awdlab/jig/item-view';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnItemView, NgnTemplate],
  selector: 'awd-demo-item-view-strategies',
  template: `
    @for (strategy of strategies; track $index) {
      {{ strategy }}:
      <awd-item-view
        #itemView
        [items]="items"
        [idField]="'id'"
        style="background: var(--awd-color-surface-200);"
        [overflowStrategy]="strategy"
        [overflowStrategyIndex]="2"
      >
        <ng-template #item [ngnTemplate]="itemView.templateTypes.item" let-item>
          <span style="padding: 4px; background: var(--awd-color-surface-400);">
            {{ item.label }}
          </span>
        </ng-template>
      </awd-item-view>
    }
  `,
  host: { class: 'flex-1' },
})
export class Demo_ItemView_Strategies {
  protected readonly items = exampleData.items.flat.slice(0, 5);
  protected readonly strategies = ['start', 'end', 'center', 'aroundIndex'] as const;
}
