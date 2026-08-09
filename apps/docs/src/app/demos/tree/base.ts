import { Component } from '@angular/core';
import { AwdTree } from '@awdlab/jig/tree';

import type { AwdTreeItem } from '@awdlab/jig/api';

@Component({
  imports: [AwdTree],
  selector: 'jig-demo-tree-base',
  template: `<jig-tree [items]="items" [multiple]="true" style="height: 300px;" />`,
})
export class Demo_Tree_Base {
  protected readonly items: AwdTreeItem[] = [
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
