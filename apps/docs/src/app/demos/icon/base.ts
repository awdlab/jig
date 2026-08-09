import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { AwdIcon } from '@awdlab/jig/icon';

@Component({
  imports: [AwdIcon],
  selector: 'jig-demo-icon-base',
  template: ` <jig-icon [icon]="icon" /> `,
})
export class Demo_Icon_Base {
  protected readonly icon = tablerUser;
}
