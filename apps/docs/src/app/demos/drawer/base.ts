import { Component, signal } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdDrawer } from '@awdlab/jig/drawer';

@Component({
  imports: [AwdDrawer, AwdButton],
  selector: 'jig-demo-drawer-base',
  template: `<button ngnButton (click)="open.set(true)">Open Drawer</button>
    <jig-drawer
      [header]="'Drawer Header'"
      [modal]="true"
      [open]="open()"
      [closeBy]="'any'"
      (openChange)="open.set($event)"
    >
      Content
    </jig-drawer>`,
})
export class Demo_Drawer_Base {
  protected readonly open = signal(false);
}
