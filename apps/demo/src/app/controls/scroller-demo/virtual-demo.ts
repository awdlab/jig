import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api';
import { Scroller } from '@ngneers/controls/scroller';

import { exampleData } from '../../helper/data';

@Component({
  imports: [Scroller, NgnTemplate],
  selector: 'ngn-list-box-virtual',
  template: `
    <ngn-scroller
      #scroller
      style="height: 300px"
      [items]="items"
      [virtual]="true"
      [itemHeight]="35"
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
  public readonly items = exampleData.items.flatGrouped;
}
