import { Component, signal } from '@angular/core';
import { NgnDrawer } from '@ngneers/controls/drawer';

@Component({
  imports: [NgnDrawer],
  selector: 'demo-drawer-base',
  template: `<button (click)="open.set(true)">Open Drawer</button>
    <ngn-drawer
      [title]="'test'"
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
