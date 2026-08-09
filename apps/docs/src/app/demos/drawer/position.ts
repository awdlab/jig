import { Component, signal } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdDrawer } from '@awdlab/jig/drawer';

@Component({
  imports: [AwdDrawer, AwdButton],
  selector: 'jig-demo-drawer-position',
  template: `<button ngnButton (click)="position.set('left')">←</button>
    <button ngnButton (click)="position.set('right')">→</button>
    <button ngnButton (click)="position.set('top')">↑</button>
    <button ngnButton (click)="position.set('bottom')">↓</button>
    <button ngnButton (click)="position.set('fullscreen')">↔</button>
    <jig-drawer
      [header]="'Drawer ' + position()"
      [position]="position() ?? 'left'"
      [open]="!!position()"
      [closeBy]="'any'"
      (closed)="position.set(null)"
    >
      Content
    </jig-drawer>`,
})
export class Demo_Drawer_Position {
  protected readonly position = signal<'left' | 'right' | 'top' | 'bottom' | 'fullscreen' | null>(
    null
  );
}
