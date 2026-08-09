import { Component } from '@angular/core';
import { NgnTemplate } from '@awdlab/jig/api/ng';
import { NgnScroller, NgnScrollerItem } from '@awdlab/jig/scroller';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnScroller, NgnTemplate, NgnScrollerItem],
  selector: 'awd-demo-scroller-base',
  template: `
    <awd-scroller #scroller style="height: 300px" [items]="items">
      <ng-template #item [ngnTemplate]="scroller.templateTypes.item" let-item>
        <span [ngnScrollerItem]="item">
          {{ item.label }}
        </span>
      </ng-template>
    </awd-scroller>
  `,
})
export class Demo_Scroller_Base {
  protected readonly items = exampleData.items.flat;
}
