import { Component } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigScroller, JigScrollerItem } from '@awdlab/jig/scroller';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigScroller, JigTemplate, JigScrollerItem],
  selector: 'jig-demo-scroller-virtual',
  template: `
    <jig-scroller
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
    </jig-scroller>
  `,
  host: { class: 'w-48' },
})
export class Demo_Scroller_Virtual {
  protected readonly items = exampleData.items.flat;
}
