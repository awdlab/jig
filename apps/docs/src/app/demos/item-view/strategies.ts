import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnItemView } from '@ngneers/controls/item-view';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnItemView, NgnTemplate],
  selector: 'ngn-demo-item-view-strategies',
  template: `
    @for (strategy of strategies; track $index) {
      {{ strategy }}:
      <ngn-item-view
        #itemView
        [items]="items"
        [idField]="'id'"
        style="background: var(--ngn-color-surface-200);"
        [overflowStrategy]="strategy"
        [overflowStrategyIndex]="2"
      >
        <ng-template #item [ngnTemplate]="itemView.templateTypes.item" let-item>
          <span style="padding: 4px; background: var(--ngn-color-surface-400);">
            {{ item.label }}
          </span>
        </ng-template>
      </ngn-item-view>
    }
  `,
  host: { class: 'flex-1' },
})
export class Demo_ItemView_Strategies {
  protected readonly items = exampleData.items.flat.slice(0, 5);
  protected readonly strategies = ['start', 'end', 'center', 'aroundIndex'] as const;
}
