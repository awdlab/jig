import { Component, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { type MenuItem, NgnMenu } from '@awdlab/jig/menu';

@Component({
  selector: 'awd-demo-menu-popover',
  imports: [NgnMenu, NgnButton],
  template: ` <button ngnButton #anchor (click)="menu.show()">Open Menu</button>
    <awd-menu #menu [popover]="true" [anchor]="anchor" [items]="items()" />`,
})
export class Demo_Menu_Popover {
  public readonly items = signal<MenuItem[]>([
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ]);
}
