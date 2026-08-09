import { Component } from '@angular/core';
import { AwdTemplate } from '@awdlab/jig/api/ng';
import { AwdScroller, AwdScrollerItem } from '@awdlab/jig/scroller';

import { exampleData } from '../../helper/data';

@Component({
  imports: [AwdScroller, AwdTemplate, AwdScrollerItem],
  selector: 'jig-demo-scroller-base',
  template: `
    <jig-scroller #scroller style="height: 300px" [items]="items">
      <ng-template #item [ngnTemplate]="scroller.templateTypes.item" let-item>
        <span [ngnScrollerItem]="item">
          {{ item.label }}
        </span>
      </ng-template>
    </jig-scroller>
  `,
})
export class Demo_Scroller_Base {
  protected readonly items = exampleData.items.flat;
}
