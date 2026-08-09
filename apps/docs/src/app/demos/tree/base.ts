import { Component } from '@angular/core';
import { JigTree } from '@awdlab/jig/tree';

import type { JigTreeItem } from '@awdlab/jig/api';

@Component({
  imports: [JigTree],
  selector: 'jig-demo-tree-base',
  template: `<jig-tree [items]="items" [multiple]="true" style="height: 300px;" />`,
})
export class Demo_Tree_Base {
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
            { label: 'Q2.xlsx', value: 'q2', disabled: true },
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
