import { Component, signal, viewChild } from '@angular/core';
import { type BreadcrumbItem, AwdBreadcrumb } from '@awdlab/jig/breadcrumb';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-breadcrumb-playground',
  imports: [AwdBreadcrumb, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdBreadcrumb', component: component() }]">
      <jig-breadcrumb class="flex-1" #ref [items]="items()" />
    </jig-docs-playground>
  `,
})
export class AwdDocsBreadcrumbPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdBreadcrumb });
  protected readonly items = signal<BreadcrumbItem[]>([
    { label: 'Item 1', id: 'item-1' },
    { label: 'Item 2', id: 'item-2' },
    { label: 'Item 3', id: 'item-3' },
  ]);
}
