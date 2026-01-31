import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { BreadcrumbItem, NgnBreadcrumb } from '@ngneers/controls/breadcrumb';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnBreadcrumb, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnBreadcrumb', component: component() }]">
      <ngn-breadcrumb class="flex-1" #ref [items]="items()" />
    </ngn-docs-playground>
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
