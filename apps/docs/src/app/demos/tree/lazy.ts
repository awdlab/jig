import { Component } from '@angular/core';
import { AwdTree } from '@awdlab/jig/tree';

import type { AwdTreeItem } from '@awdlab/jig/api';

@Component({
  imports: [AwdTree],
  selector: 'jig-demo-tree-lazy',
  template: `
    <jig-tree
      [items]="items"
      [loadChildren]="loadChildren"
      style="display: block; height: 300px;"
    />
  `,
})
export class Demo_Tree_Lazy {
  // Marked `lazy` — children are fetched on first expand.
  protected readonly items: AwdTreeItem[] = [
    { label: 'Root A', value: 'a', lazy: true },
    { label: 'Root B', value: 'b', lazy: true },
    { label: 'Leaf (no children)', value: 'leaf' },
  ];

  // Simulates an async fetch; the tree shows a spinner while this resolves.
  protected readonly loadChildren = (item: AwdTreeItem): Promise<AwdTreeItem[]> =>
    new Promise(resolve =>
      setTimeout(
        () =>
          resolve([
            { label: `${item.label} / child 1`, value: `${item.value}-1` },
            { label: `${item.label} / child 2`, value: `${item.value}-2` },
            { label: `${item.label} / subfolder`, value: `${item.value}-sub`, lazy: true },
          ]),
        800
      )
    );
}
