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
    { id: '1', label: 'Item 1', icon: 'icon-1' },
    { id: '2', label: 'Item 2', icon: 'icon-2' },
    { id: '3', label: 'Item 3', icon: 'icon-3' },
    { separator: true },
    {
      id: '4',
      label: 'Item 4',
      icon: 'icon-4',
      children: [
        { id: '4-1', label: 'Item 4-1', icon: 'icon-4-1' },
        { id: '4-2', label: 'Item 4-2', icon: 'icon-4-2' },
        { id: '4-3', label: 'Item 4-3', icon: 'icon-4-3' },
      ],
    },
    {
      id: '5',
      label: 'Item 5',
      icon: 'icon-5',
      children: [
        { id: '5-1', label: 'Item 5-1', icon: 'icon-5-1' },
        { id: '5-2', label: 'Item 5-2', icon: 'icon-5-2' },
        {
          id: '5-3',
          label: 'Item 5-3',
          icon: 'icon-5-3',
          children: [
            { id: '5-3-1', label: 'Item 5-3-1', icon: 'icon-5-3-1' },
            { id: '5-3-2', label: 'Item 5-3-2', icon: 'icon-5-3-2' },
            { id: '5-3-3', label: 'Item 5-3-3', icon: 'icon-5-3-3' },
          ],
        },
      ],
    },
  ]);
}
