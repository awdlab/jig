import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api';
import { NgnScroller } from '@ngneers/controls/scroller';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnScroller, NgnTemplate],
  selector: 'ngn-list-box-base',
  template: `
    <ngn-scroller #scroller style="height: 300px" [items]="items">
      <ng-template #item [ngnTemplate]="scroller.templateTypes.item" let-item>
        <span>
          {{ item.label }}
        </span>
      </ng-template>
    </ngn-scroller>
  `,
})
export class Scroller_Base_Component {
  protected readonly items = exampleData.items.flat;
}
