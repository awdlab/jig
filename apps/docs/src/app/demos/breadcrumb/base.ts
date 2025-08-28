import { Component, signal } from '@angular/core';
import { BreadcrumbItem, NgnBreadcrumb } from '@ngneers/controls/breadcrumb';

@Component({
  imports: [NgnBreadcrumb],
  template: `<ngn-breadcrumb [items]="items()" />`,
})
export class Demo_Breadcrumb_Base {
  protected readonly items = signal<BreadcrumbItem[]>([
    { label: 'Item 1', id: 'item-1' },
    { label: 'Item 2', id: 'item-2' },
    { label: 'Item 3', id: 'item-3' },
    { label: 'Item 4', id: 'item-4' },
    { label: 'Item 5', id: 'item-5' },
    { label: 'Item 6', id: 'item-6' },
    { label: 'Item 7', id: 'item-7' },
    { label: 'Item 8', id: 'item-8' },
    { label: 'Item 9', id: 'item-9' },
    { label: 'Item 10', id: 'item-10' },
  ]);
}
