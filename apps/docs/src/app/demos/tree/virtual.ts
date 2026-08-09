import { Component } from '@angular/core';
import { JigTree } from '@awdlab/jig/tree';

import type { JigTreeItem } from '@awdlab/jig/api';

@Component({
  imports: [JigTree],
  selector: 'jig-demo-tree-virtual',
  template: `
    <jig-tree
      [items]="items"
      [virtual]="true"
      [itemHeight]="36"
      [multiple]="true"
      style="display: block; height: 300px;"
    />
  `,
})
export class Demo_Tree_Virtual {
  // 50 folders x 100 files = 5050 nodes; only the visible rows are rendered.
  protected readonly items: JigTreeItem[] = Array.from({ length: 50 }, (_, g) => ({
    label: `Folder ${g + 1}`,
    value: `folder-${g}`,
    items: Array.from({ length: 100 }, (_, i) => ({
      label: `File ${g + 1}.${i + 1}`,
      value: `file-${g}-${i}`,
    })),
  }));
}
