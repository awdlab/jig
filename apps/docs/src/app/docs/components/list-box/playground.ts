import { Component, viewChild } from '@angular/core';
import { JigListBox } from '@awdlab/jig/list-box';

import { JigDocsPlayground } from '../../../utils/playground/playground';

import type { JigItem } from '@awdlab/jig/api';

@Component({
  selector: 'jig-docs-list-box-playground',
  imports: [JigListBox, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigListBox', component: component() }]">
      <jig-list-box #ref class="flex-1" [items]="items" style="display: block; height: 200px;" />
    </jig-docs-playground>
  `,
})
export class JigDocsListBoxPlayground {
  protected readonly component = viewChild.required('ref', { read: JigListBox });
  protected readonly items: JigItem[] = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
  ];
}
