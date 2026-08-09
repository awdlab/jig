import { Component, viewChild } from '@angular/core';
import { NgnListBox } from '@awdlab/jig/list-box';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

import type { NgnItem } from '@awdlab/jig/api';

@Component({
  selector: 'awd-docs-list-box-playground',
  imports: [NgnListBox, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnListBox', component: component() }]">
      <awd-list-box #ref class="flex-1" [items]="items" style="display: block; height: 200px;" />
    </awd-docs-playground>
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
