import { Component, signal } from '@angular/core';
import { NgnDrawer } from '@ngneers/controls/drawer';

@Component({
  imports: [NgnDrawer],
  template: `<button (click)="open.set(true)">Open Dialog</button>
    <ngn-drawer [title]="'test'" [open]="open()" [closeBy]="'any'" (openChange)="open.set($event)">
      Content
      <button autofocus>awd</button>
    </ngn-drawer>`,
})
export class Demo_Drawer_Base {
  protected readonly open = signal(false);
}
