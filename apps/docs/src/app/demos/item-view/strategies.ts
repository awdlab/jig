import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnItemView } from '@ngneers/controls/item-view';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnItemView, NgnTemplate],
  selector: 'ngn-demo-item-view-strategies',
  template: `
    @for (strategy of strategies; track $index) {
      <ngn-item-view
        #itemView
        [items]="items"
        [idField]="'id'"
        style="background: red;"
        [overflowStrategy]="strategy"
        [overflowStrategyIndex]="2"
        [overflowStrategyFreezeCount]="1"
        [separator]="'|'"
      >
        <ng-template #item [ngnTemplate]="itemView.templateTypes.item" let-item>
          <span style="padding: 4px; background: gray;">
            {{ item.label }}
          </span>
        </ng-template>
      </ngn-item-view>
    }
  `,
})
export class Demo_ItemView_Strategies {
  protected readonly items = exampleData.items.flat.slice(0, 5);
  protected readonly strategies = ['start', 'end', 'center', 'aroundIndex'] as const;
}
