import { Component, viewChild } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigScroller, JigScrollerItem } from '@awdlab/jig/scroller';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-scroller-playground',
  imports: [JigScroller, JigTemplate, JigScrollerItem, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigScroller', component: component() }]">
      <jig-scroller class="flex-1" #ref style="height: 200px" [items]="items">
        <ng-template #item [ngnTemplate]="component().templateTypes.item" let-item>
          <span [ngnScrollerItem]="item">{{ item.label }}</span>
        </ng-template>
      </jig-scroller>
    </jig-docs-playground>
  `,
})
export class JigDocsScrollerPlayground {
  protected readonly component = viewChild.required('ref', { read: JigScroller });
  protected readonly items = [
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ];
}
