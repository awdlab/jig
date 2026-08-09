import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnAvatar } from '@awdlab/jig/avatar';
import { NgnIcon } from '@awdlab/jig/icon';

@Component({
  selector: 'awd-demo-avatar-icon',
  imports: [NgnAvatar, NgnIcon],
  template: `
    <awd-avatar>
      <awd-icon [icon]="icon" />
    </awd-avatar>
  `,
})
export class Demo_Avatar_Icon {
  protected readonly icon = tablerUser;
}
