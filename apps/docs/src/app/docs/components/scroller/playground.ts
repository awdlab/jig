import { Component, viewChild } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnScroller, NgnScrollerItem } from '@ngneers/controls/scroller';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-scroller-playground',
  imports: [NgnScroller, NgnTemplate, NgnScrollerItem, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnScroller', component: component() }]">
      <ngn-scroller class="flex-1" #ref style="height: 200px" [items]="items">
        <ng-template #item [ngnTemplate]="component().templateTypes.item" let-item>
          <span [ngnScrollerItem]="item">{{ item.label }}</span>
        </ng-template>
      </ngn-scroller>
    </ngn-docs-playground>
  `,
})
export class NgnDocsScrollerPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnScroller });
  protected readonly items = [
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ];
}
