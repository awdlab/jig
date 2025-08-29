import { Component, signal } from '@angular/core';
import { BreadcrumbItem, NgnBreadcrumb } from '@ngneers/controls/breadcrumb';

@Component({
  imports: [NgnBreadcrumb],
  template: `<ngn-breadcrumb [items]="items()" /> <button (click)="click()">Click me</button>`,
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

  protected click() {
    this.items.update(items => {
      const copy = [...items];
      if (copy[4].label.length > 8) {
        copy[4] = { label: 'Item 5', id: 'item-5', callback: () => {} };
      } else {
        copy[4] = { label: 'Item 5 (longer label yeehaw)', id: 'item-5', callback: () => {} };
      }
      return copy;
    });
  }
}
