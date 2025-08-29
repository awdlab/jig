import { Component, signal } from '@angular/core';
import { MenuItem, NgnMenu } from '@ngneers/controls/menu';

@Component({
  imports: [NgnMenu],
  template: ` <button #anchor (click)="menu.open()">Open Menu</button>
    <ngn-menu #menu [popover]="true" [anchor]="anchor" [items]="items()" />`,
})
export class Demo_Menu_Base {
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
    { id: '5', label: 'Item 5', icon: 'icon-5' },
  ]);
}
