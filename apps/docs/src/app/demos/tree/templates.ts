import { Component } from '@angular/core';
import { NgnTree } from '@awdlab/jig/tree';

import { fileTree } from './sample-data';

@Component({
  imports: [NgnTree],
  selector: 'awd-demo-tree-templates',
  template: `
    <awd-tree [items]="items" style="display: block; height: 300px;">
      <ng-template #item let-item let-hasChildren="hasChildren" let-expanded="expanded">
        <span>{{ hasChildren ? (expanded ? '📂' : '📁') : '📄' }} {{ item.label }}</span>
      </ng-template>
    </awd-tree>
  `,
})
export class Demo_Tree_Templates {
  protected readonly items = fileTree;
}
