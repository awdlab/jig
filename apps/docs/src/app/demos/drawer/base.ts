import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigDrawer } from '@awdlab/jig/drawer';

@Component({
  imports: [JigDrawer, JigButton],
  selector: 'jig-demo-drawer-base',
  template: `<button jigButton (click)="open.set(true)">Open Drawer</button>
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
