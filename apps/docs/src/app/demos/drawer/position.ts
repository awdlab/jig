import { Component, signal } from '@angular/core';
import { NgnDrawer } from '@ngneers/controls/drawer';

@Component({
  imports: [NgnDrawer],
  selector: 'ngn-demo-drawer-position',
  template: `<button (click)="position.set('left')">←</button>
    <button (click)="position.set('right')">→</button>
    <button (click)="position.set('top')">↑</button>
    <button (click)="position.set('bottom')">↓</button>
    <ngn-drawer
      [title]="'test'"
      [header]="'Drawer ' + position()"
      [position]="position() ?? 'left'"
      [open]="!!position()"
      [closeBy]="'any'"
      (closed)="position.set(null)"
    >
      Content
    </ngn-drawer>`,
})
export class Demo_Drawer_Position {
  protected readonly position = signal<'left' | 'right' | 'top' | 'bottom' | null>(null);
}
