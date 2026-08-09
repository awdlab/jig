import { Component } from '@angular/core';
import { AwdTree } from '@awdlab/jig/tree';

import { fileTree } from './sample-data';

@Component({
  imports: [AwdTree],
  selector: 'jig-demo-tree-templates',
  template: `
    <jig-tree [items]="items" style="display: block; height: 300px;">
      <ng-template #item let-item let-hasChildren="hasChildren" let-expanded="expanded">
        <span>{{ hasChildren ? (expanded ? '📂' : '📁') : '📄' }} {{ item.label }}</span>
      </ng-template>
    </jig-tree>
  `,
})
export class Demo_Tree_Templates {
  protected readonly items = fileTree;
}
