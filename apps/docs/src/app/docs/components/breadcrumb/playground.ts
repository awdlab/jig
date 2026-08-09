import { Component, signal, viewChild } from '@angular/core';
import { type BreadcrumbItem, NgnBreadcrumb } from '@awdlab/jig/breadcrumb';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-breadcrumb-playground',
  imports: [NgnBreadcrumb, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnBreadcrumb', component: component() }]">
      <awd-breadcrumb class="flex-1" #ref [items]="items()" />
    </awd-docs-playground>
  `,
})
export class NgnDocsBreadcrumbPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnBreadcrumb });
  protected readonly items = signal<BreadcrumbItem[]>([
    { label: 'Item 1', id: 'item-1' },
    { label: 'Item 2', id: 'item-2' },
    { label: 'Item 3', id: 'item-3' },
  ]);
}
