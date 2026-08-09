import { Component } from '@angular/core';
import { AwdTree } from '@awdlab/jig/tree';

import { fileTree } from './sample-data';

import type { AwdTreeStorageConfig } from '@awdlab/jig/tree';

@Component({
  imports: [AwdTree],
  selector: 'jig-demo-tree-storage',
  template: `
    <p style="margin-bottom: 0.5rem; font-size: 0.875rem;">
      Expand and check some nodes, then reload the page — the state is restored from localStorage.
    </p>
    <jig-tree
      [items]="items"
      [multiple]="true"
      [storage]="storage"
      style="display: block; height: 280px;"
    />
  `,
})
export class Demo_Tree_Storage {
  protected readonly items = fileTree;

  // Stable reference; key + optional AwdStorageKind (defaults to 'localstorage').
  protected readonly storage: AwdTreeStorageConfig = {
    key: 'jig-demo-tree-state',
    kind: 'localstorage',
  };
}
