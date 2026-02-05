import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { type MenuItem, NgnContextMenu } from '@ngneers/controls/menu';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-menu-context-menu',
  imports: [NgnContextMenu],
  template: `<div
    class="flex cursor-context-menu items-center justify-center rounded-md border border-dashed border-gray-400 p-4"
    [ngnContextMenu]="items()"
  >
    Right click me
  </div>`,
})
export class Demo_Menu_ContextMenu {
  protected readonly items = signal<MenuItem[]>([
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ]);
}
