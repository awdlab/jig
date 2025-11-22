import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem, NgnMenu } from '@ngneers/controls/menu';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-menu-popover',
  imports: [NgnMenu],
  template: ` <button #anchor (click)="menu.show()">Open Menu</button>
    <ngn-menu #menu [popover]="true" [anchor]="anchor" [items]="items()" />`,
})
export class Demo_Menu_Popover {
  public readonly items = signal<MenuItem[]>([
    { id: '1', label: 'Item 1', icon: 'icon-1' },
    { id: '2', label: 'Item 2', icon: 'icon-2' },
    { id: '3', label: 'Item 3', icon: 'icon-3' },
  ]);
}
