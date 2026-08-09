import { Component, signal, viewChild } from '@angular/core';
import { type BreadcrumbItem, JigBreadcrumb } from '@awdlab/jig/breadcrumb';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-breadcrumb-playground',
  imports: [JigBreadcrumb, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigBreadcrumb', component: component() }]">
      <jig-breadcrumb class="flex-1" #ref [items]="items()" />
    </jig-docs-playground>
  `,
})
export class JigDocsBreadcrumbPlayground {
  protected readonly component = viewChild.required('ref', { read: JigBreadcrumb });
  protected readonly items = signal<BreadcrumbItem[]>([
    { label: 'Item 1', id: 'item-1' },
    { label: 'Item 2', id: 'item-2' },
    { label: 'Item 3', id: 'item-3' },
  ]);
}
