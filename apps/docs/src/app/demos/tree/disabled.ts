import { Component } from '@angular/core';
import { NgnTree } from '@awdlab/jig/tree';

import type { NgnTreeItem } from '@awdlab/jig/api';

@Component({
  imports: [NgnTree],
  selector: 'awd-demo-tree-disabled',
  template: `<awd-tree [items]="items" [multiple]="true" style="display: block; height: 300px;" />`,
})
export class Demo_Tree_Disabled {
  protected readonly items: NgnTreeItem[] = [
    {
      label: 'Active project',
      value: 'project',
      items: [
        {
          label: 'src',
          value: 'src',
          items: [
            { label: 'index.ts', value: 'index.ts' },
            { label: 'legacy.ts (disabled)', value: 'legacy.ts', disabled: true },
          ],
        },
        {
          // A disabled branch disables its whole subtree, but stays expandable.
          label: 'archive (disabled subtree)',
          value: 'archive',
          disabled: true,
          items: [
            { label: 'old-a.ts', value: 'old-a.ts' },
            { label: 'old-b.ts', value: 'old-b.ts' },
          ],
        },
      ],
    },
    { label: 'locked-file.ts (disabled)', value: 'locked', disabled: true },
  ];
}
