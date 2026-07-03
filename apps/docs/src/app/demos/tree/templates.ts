import { Component } from '@angular/core';
import { NgnTree } from '@ngneers/controls/tree';

import { fileTree } from './sample-data';

@Component({
  imports: [NgnTree],
  selector: 'ngn-demo-tree-templates',
  template: `
    <ngn-tree [items]="items" style="display: block; height: 300px;">
      <ng-template #item let-item let-hasChildren="hasChildren" let-expanded="expanded">
        <span>{{ hasChildren ? (expanded ? '📂' : '📁') : '📄' }} {{ item.label }}</span>
      </ng-template>
    </ngn-tree>
  `,
})
export class Demo_Tree_Templates {
  protected readonly items = fileTree;
}
