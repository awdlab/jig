import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnItemView } from '@ngneers/controls/item-view';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnItemView, NgnTemplate],
  selector: 'ngn-demo-item-view-separator',
  template: `
    <ngn-item-view
      #itemView
      [items]="items"
      [idField]="'id'"
      [separator]="'|'"
      [overflowStrategy]="'end'"
      [overflowStrategyFreezeCount]="1"
      [overflowStrategyIndex]="2"
      style="background: var(--ngn-color-surface-200);"
    >
      <ng-template #item [ngnTemplate]="itemView.templateTypes.item" let-item>
        <span style="padding: 4px; background: var(--ngn-color-surface-400);">
          {{ item.label }}
        </span>
      </ng-template>
      <ng-template #separator [ngnTemplate]="itemView.templateTypes.separator" let-separator>
        <span style="padding: 4px; background: var(--ngn-color-surface-300);">
          {{ separator.character }}
        </span>
      </ng-template>
    </ngn-item-view>
  `,
  host: { class: 'contents' },
})
export class Demo_ItemView_Separator {
  protected readonly items = exampleData.items.flat.slice(0, 5);
}
