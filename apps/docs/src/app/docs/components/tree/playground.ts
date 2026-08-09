import { Component, viewChild } from '@angular/core';
import { NgnTree } from '@awdlab/jig/tree';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

import type { NgnTreeItem } from '@awdlab/jig/api';

@Component({
  selector: 'awd-docs-tree-playground',
  imports: [NgnTree, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnTree', component: component() }]">
      <awd-tree #ref class="flex-1" [items]="items" [multiple]="true" style="height: 300px;" />
    </awd-docs-playground>
  `,
})
export class NgnDocsTreePlayground {
  protected readonly component = viewChild.required('ref', { read: NgnTree });
  protected readonly items: NgnTreeItem[] = [
    {
      label: 'Documents',
      value: 'documents',
      items: [
        { label: 'Resume.pdf', value: 'resume' },
        { label: 'Cover Letter.docx', value: 'cover' },
        {
          label: 'Reports',
          value: 'reports',
          items: [
            { label: 'Q1.xlsx', value: 'q1' },
            { label: 'Q2.xlsx', value: 'q2' },
          ],
        },
      ],
    },
    {
      label: 'Pictures',
      value: 'pictures',
      items: [
        { label: 'Vacation.jpg', value: 'vacation' },
        { label: 'Profile.png', value: 'profile' },
      ],
    },
    { label: 'Readme.txt', value: 'readme' },
  ];
}
