import { Component, signal } from '@angular/core';
import { type BreadcrumbItem, NgnBreadcrumb } from '@awdlab/jig/breadcrumb';

@Component({
  selector: 'awd-demo-breadcrumb-base',
  imports: [NgnBreadcrumb],
  template: `<awd-breadcrumb [items]="items()" />`,
  host: { class: 'flex-1' },
})
export class Demo_Breadcrumb_Base {
  protected readonly items = signal<BreadcrumbItem[]>([
    { label: 'Item 1', id: 'item-1', callback: () => {} },
    { label: 'Item 2', id: 'item-2', callback: () => {} },
    { label: 'Item 3', id: 'item-3', callback: () => {} },
    { label: 'Item 4', id: 'item-4', callback: () => {} },
    { label: 'Item 5', id: 'item-5', callback: () => {} },
    { label: 'Item 6', id: 'item-6', callback: () => {} },
    { label: 'Item 7', id: 'item-7', callback: () => {} },
    { label: 'Item 8', id: 'item-8', callback: () => {} },
    { label: 'Item 9', id: 'item-9', callback: () => {} },
    { label: 'Item 10', id: 'item-10' },
  ]);
}
