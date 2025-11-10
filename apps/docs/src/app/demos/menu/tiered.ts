import { Component, signal } from '@angular/core';
import { MenuItem, NgnMenu } from '@ngneers/controls/menu';

@Component({
  selector: 'ngn-demo-menu-tiered',
  imports: [NgnMenu],
  template: `<ngn-menu class="w-40 block" #menu [items]="items()" />`,
})
export class Demo_Menu_Tiered {
  public readonly items = signal<MenuItem[]>([
    { id: '1', label: 'Item 1', icon: 'icon-1' },
    { id: '2', label: 'Item 2', icon: 'icon-2' },
    { id: '3', label: 'Item 3', icon: 'icon-3' },
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
