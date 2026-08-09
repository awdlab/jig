import { Component, viewChild } from '@angular/core';
import { AwdTemplate } from '@awdlab/jig/api/ng';
import { AwdScroller, AwdScrollerItem } from '@awdlab/jig/scroller';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-scroller-playground',
  imports: [AwdScroller, AwdTemplate, AwdScrollerItem, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdScroller', component: component() }]">
      <jig-scroller class="flex-1" #ref style="height: 200px" [items]="items">
        <ng-template #item [ngnTemplate]="component().templateTypes.item" let-item>
          <span [ngnScrollerItem]="item">{{ item.label }}</span>
        </ng-template>
      </jig-scroller>
    </jig-docs-playground>
  `,
})
export class AwdDocsScrollerPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdScroller });
  protected readonly items = [
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ];
}
