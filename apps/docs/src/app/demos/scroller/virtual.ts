import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnScroller, NgnScrollerItem } from '@ngneers/controls/scroller';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnScroller, NgnTemplate, NgnScrollerItem],
  selector: 'ngn-demo-scroller-virtual',
  template: `
    <ngn-scroller
      #scroller
      style="height: 300px"
      [items]="items"
      [virtual]="true"
      [itemHeight]="35"
      [virtualPadding]="2"
    >
      <ng-template #item [ngnTemplate]="scroller.templateTypes.item" let-item>
        <span [ngnScrollerItem]="item">
          {{ item.label }}
        </span>
      </ng-template>
    </ngn-scroller>
  `,
})
export class Demo_Scroller_Virtual {
  protected readonly items = exampleData.items.flat;
}
