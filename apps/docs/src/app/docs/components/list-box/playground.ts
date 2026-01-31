import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnItem } from '@ngneers/controls/api';
import { NgnListBox } from '@ngneers/controls/list-box';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnListBox, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnListBox', component: component() }]">
      <ngn-list-box #ref class="flex-1" [items]="items" style="display: block; height: 200px;" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsListBoxPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnListBox });
  protected readonly items: NgnItem[] = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
  ];
}
