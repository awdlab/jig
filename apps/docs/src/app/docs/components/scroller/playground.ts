import { Component, viewChild } from '@angular/core';
import { NgnTemplate } from '@awdlab/jig/api/ng';
import { NgnScroller, NgnScrollerItem } from '@awdlab/jig/scroller';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-scroller-playground',
  imports: [NgnScroller, NgnTemplate, NgnScrollerItem, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnScroller', component: component() }]">
      <awd-scroller class="flex-1" #ref style="height: 200px" [items]="items">
        <ng-template #item [ngnTemplate]="component().templateTypes.item" let-item>
          <span [ngnScrollerItem]="item">{{ item.label }}</span>
        </ng-template>
      </awd-scroller>
    </awd-docs-playground>
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
