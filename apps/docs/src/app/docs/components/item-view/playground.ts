import { Component, viewChild } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigItemView } from '@awdlab/jig/item-view';

import { JigDocsPlayground } from '../../../utils/playground/playground';

type ItemType = { id: string; label: string };

@Component({
  selector: 'jig-docs-item-view-playground',
  imports: [JigItemView, JigTemplate, JigDocsPlayground],
  template: `
    <jig-docs-playground
      class="flex-1"
      [controls]="[{ componentName: 'JigItemView', component: component() }]"
    >
      <jig-item-view #ref [items]="items" [idField]="'id'">
        <ng-template #item [ngnTemplate]="ref.templateTypes.item" let-item>
          <span style="padding: 4px;">{{ item.label }}</span>
        </ng-template>
      </jig-item-view>
    </jig-docs-playground>
  `,
})
export class JigDocsItemViewPlayground {
  protected readonly component = viewChild.required('ref', { read: JigItemView });
  protected readonly items: ItemType[] = [
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ];
}
