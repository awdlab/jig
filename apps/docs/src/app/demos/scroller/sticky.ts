import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnScroller, NgnScrollerItem } from '@ngneers/controls/scroller';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnScroller, NgnTemplate, NgnScrollerItem],
  selector: 'ngn-demo-scroller-sticky',
  template: `
    <ngn-scroller #scroller style="height: 300px" [items]="items" [fieldSticky]="'items'">
      <ng-template #item [ngnTemplate]="scroller.templateTypes.item" let-item>
        <span [ngnScrollerItem]="item">
          {{ item.label }}
        </span>
      </ng-template>
    </ngn-scroller>
  `,
})
export class Demo_Scroller_Sticky {
  protected readonly items = exampleData.items.flatGrouped;
}
