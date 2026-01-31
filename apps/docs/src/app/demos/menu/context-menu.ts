import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem, NgnContextMenu } from '@ngneers/controls/menu';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-menu-context-menu',
  imports: [NgnContextMenu],
  template: `<div
    class="p-4 flex items-center justify-center border border-dashed border-gray-400 rounded-md cursor-context-menu"
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
