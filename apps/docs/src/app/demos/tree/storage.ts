import { Component } from '@angular/core';
import { NgnTree } from '@awdlab/jig/tree';

import { fileTree } from './sample-data';

import type { NgnTreeStorageConfig } from '@awdlab/jig/tree';

@Component({
  imports: [NgnTree],
  selector: 'awd-demo-tree-storage',
  template: `
    <p style="margin-bottom: 0.5rem; font-size: 0.875rem;">
      Expand and check some nodes, then reload the page — the state is restored from localStorage.
    </p>
    <awd-tree
      [items]="items"
      [multiple]="true"
      [storage]="storage"
      style="display: block; height: 280px;"
    />
  `,
})
export class Demo_Tree_Storage {
  protected readonly items = fileTree;

  // Stable reference; key + optional NgnStorageKind (defaults to 'localstorage').
  protected readonly storage: NgnTreeStorageConfig = {
    key: 'awd-demo-tree-state',
    kind: 'localstorage',
  };
}
