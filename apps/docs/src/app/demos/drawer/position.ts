import { Component, signal } from '@angular/core';
import { NgnDrawer } from '@ngneers/controls/drawer';

@Component({
  imports: [NgnDrawer],
  selector: 'demo-drawer-position',
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
      (openChange)="!$event && position.set(null)"
    >
      Content
    </ngn-drawer>`,
})
export class Demo_Drawer_Position {
  protected readonly position = signal<'left' | 'right' | 'top' | 'bottom' | null>(null);
}
