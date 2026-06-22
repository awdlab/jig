import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  imports: [NgnIcon],
  selector: 'ngn-demo-icon-base',
  template: ` <ngn-icon [icon]="icon" /> `,
})
export class Demo_Icon_Base {
  protected readonly icon = tablerUser;
}
