import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { AwdAvatar } from '@awdlab/jig/avatar';
import { AwdIcon } from '@awdlab/jig/icon';

@Component({
  selector: 'jig-demo-avatar-icon',
  imports: [AwdAvatar, AwdIcon],
  template: `
    <jig-avatar>
      <jig-icon [icon]="icon" />
    </jig-avatar>
  `,
})
export class Demo_Avatar_Icon {
  protected readonly icon = tablerUser;
}
