import { Component, signal } from '@angular/core';
import { JigTree } from '@awdlab/jig/tree';

import { fileTree } from './sample-data';

@Component({
  imports: [JigTree],
  selector: 'jig-demo-tree-filter',
  template: `
    <input
      #filterInput
      type="text"
      placeholder="Filter files..."
      (input)="filterText.set(filterInput.value)"
      style="display: block; margin-bottom: 0.5rem;"
    />
    <jig-tree
      [items]="items"
      [filter]="true"
      [filterText]="filterText()"
      style="display: block; height: 260px;"
    />
  `,
})
export class Demo_Tree_Filter {
  protected readonly items = fileTree;
  protected readonly filterText = signal('');
}
