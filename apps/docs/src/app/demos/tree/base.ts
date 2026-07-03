import { Component } from '@angular/core';
import { NgnTree } from '@ngneers/controls/tree';

import type { NgnTreeItem } from '@ngneers/controls/api';

@Component({
  imports: [NgnTree],
  selector: 'ngn-demo-tree-base',
  template: `<ngn-tree [items]="items" [multiple]="true" style="height: 300px;" />`,
})
export class Demo_Tree_Base {
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
