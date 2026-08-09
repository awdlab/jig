import { Component, viewChild } from '@angular/core';
import { JigTree } from '@awdlab/jig/tree';

import { JigDocsPlayground } from '../../../utils/playground/playground';

import type { JigTreeItem } from '@awdlab/jig/api';

@Component({
  selector: 'jig-docs-tree-playground',
  imports: [JigTree, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigTree', component: component() }]">
      <jig-tree #ref class="flex-1" [items]="items" [multiple]="true" style="height: 300px;" />
    </jig-docs-playground>
  `,
})
export class JigDocsTreePlayground {
  protected readonly component = viewChild.required('ref', { read: JigTree });
  protected readonly items: JigTreeItem[] = [
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
