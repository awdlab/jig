import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api';
import { NgnScroller } from '@ngneers/controls/scroller';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnScroller, NgnTemplate],
  selector: 'ngn-list-box-virtual',
  template: `
    <ngn-scroller
      #scroller
      style="height: 300px"
      [items]="items"
      [virtual]="true"
      [itemHeight]="24"
      [padding]="2"
    >
      <ng-template #item [ngnTemplate]="scroller.templateTypes.item" let-item>
        <span style="height: 35px; display: inline-block;">
          {{ item.label }}
        </span>
      </ng-template>
    </ngn-scroller>
  `,
})
export class Scroller_Virtual_Component {
  protected readonly items = exampleData.items.flatGrouped;
}
