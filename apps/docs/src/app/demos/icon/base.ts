import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnIcon } from '@awdlab/jig/icon';

@Component({
  imports: [NgnIcon],
  selector: 'awd-demo-icon-base',
  template: ` <awd-icon [icon]="icon" /> `,
})
export class Demo_Icon_Base {
  protected readonly icon = tablerUser;
}
