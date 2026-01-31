import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnItemView } from '@ngneers/controls/item-view';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

type ItemType = { id: string; label: string };

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnItemView, NgnTemplate, NgnDocsPlayground],
  template: `
    <ngn-docs-playground
      class="flex-1"
      [controls]="[{ componentName: 'NgnItemView', component: component() }]"
    >
      <ngn-item-view #ref [items]="items" [idField]="'id'">
        <ng-template #item [ngnTemplate]="ref.templateTypes.item" let-item>
          <span style="padding: 4px;">{{ item.label }}</span>
        </ng-template>
      </ngn-item-view>
    </ngn-docs-playground>
  `,
})
export class NgnDocsItemViewPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnItemView });
  protected readonly items: ItemType[] = [
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ];
}
