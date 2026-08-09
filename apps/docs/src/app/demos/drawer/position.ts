import { Component, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnDrawer } from '@awdlab/jig/drawer';

@Component({
  imports: [NgnDrawer, NgnButton],
  selector: 'awd-demo-drawer-position',
  template: `<button ngnButton (click)="position.set('left')">←</button>
    <button ngnButton (click)="position.set('right')">→</button>
    <button ngnButton (click)="position.set('top')">↑</button>
    <button ngnButton (click)="position.set('bottom')">↓</button>
    <button ngnButton (click)="position.set('fullscreen')">↔</button>
    <awd-drawer
      [header]="'Drawer ' + position()"
      [position]="position() ?? 'left'"
      [open]="!!position()"
      [closeBy]="'any'"
      (closed)="position.set(null)"
    >
      Content
    </awd-drawer>`,
})
export class Demo_Drawer_Position {
  protected readonly position = signal<'left' | 'right' | 'top' | 'bottom' | 'fullscreen' | null>(
    null
  );
}
