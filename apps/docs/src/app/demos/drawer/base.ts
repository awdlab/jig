import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDrawer } from '@ngneers/controls/drawer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnDrawer, NgnButton],
  selector: 'ngn-demo-drawer-base',
  template: `<button ngnButton (click)="open.set(true)">Open Drawer</button>
    <ngn-drawer
      [header]="'Drawer Header'"
      [modal]="true"
      [open]="open()"
      [closeBy]="'any'"
      (openChange)="open.set($event)"
    >
      Content
    </ngn-drawer>`,
})
export class Demo_Drawer_Base {
  protected readonly open = signal(false);
}
