import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { type MenuItem, JigMenu } from '@awdlab/jig/menu';

@Component({
  selector: 'jig-demo-menu-popover',
  imports: [JigMenu, JigButton],
  template: ` <button jigButton #anchor (click)="menu.show()">Open Menu</button>
    <jig-menu #menu [popover]="true" [anchor]="anchor" [items]="items()" />`,
})
export class Demo_Menu_Popover {
  public readonly items = signal<MenuItem[]>([
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ]);
}
