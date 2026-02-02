import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDrawer } from '@ngneers/controls/drawer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnDrawer, NgnButton],
  selector: 'ngn-demo-drawer-position',
  template: `<button ngnButton (click)="position.set('left')">←</button>
    <button ngnButton (click)="position.set('right')">→</button>
    <button ngnButton (click)="position.set('top')">↑</button>
    <button ngnButton (click)="position.set('bottom')">↓</button>
    <ngn-drawer
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
