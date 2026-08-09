import { Component, viewChild } from '@angular/core';
import { AwdListBox } from '@awdlab/jig/list-box';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

import type { JigItem } from '@awdlab/jig/api';

@Component({
  selector: 'jig-docs-list-box-playground',
  imports: [AwdListBox, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdListBox', component: component() }]">
      <jig-list-box #ref class="flex-1" [items]="items" style="display: block; height: 200px;" />
    </jig-docs-playground>
  `,
})
export class AwdDocsListBoxPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdListBox });
  protected readonly items: JigItem[] = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
  ];
}
