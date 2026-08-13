import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigDrawer } from '@awdlab/jig/drawer';

@Component({
  imports: [JigDrawer, JigButton],
  selector: 'jig-demo-drawer-position',
  template: `<button jigButton (click)="position.set('start')">⇤</button>
    <button jigButton (click)="position.set('end')">⇥</button>
    <button jigButton (click)="position.set('top')">↑</button>
    <button jigButton (click)="position.set('bottom')">↓</button>
    <button jigButton (click)="position.set('fullscreen')">↔</button>
    <jig-drawer
      [header]="'Drawer ' + position()"
      [position]="position() ?? 'start'"
      [open]="!!position()"
      [closeBy]="'any'"
      (closed)="position.set(null)"
    >
      Content
    </jig-drawer>`,
})
export class Demo_Drawer_Position {
  protected readonly position = signal<'start' | 'end' | 'top' | 'bottom' | 'fullscreen' | null>(
    null
  );
}
