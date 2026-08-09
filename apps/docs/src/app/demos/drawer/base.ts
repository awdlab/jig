import { Component, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnDrawer } from '@awdlab/jig/drawer';

@Component({
  imports: [NgnDrawer, NgnButton],
  selector: 'awd-demo-drawer-base',
  template: `<button ngnButton (click)="open.set(true)">Open Drawer</button>
    <awd-drawer
      [header]="'Drawer Header'"
      [modal]="true"
      [open]="open()"
      [closeBy]="'any'"
      (openChange)="open.set($event)"
    >
      Content
    </awd-drawer>`,
})
export class Demo_Drawer_Base {
  protected readonly open = signal(false);
}
