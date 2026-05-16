import { Component, ChangeDetectionStrategy } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnAvatar } from '@ngneers/controls/avatar';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-avatar-icon',
  imports: [NgnAvatar, NgnIcon],
  template: `
    <ngn-avatar>
      <ngn-icon [icon]="icon" />
    </ngn-avatar>
  `,
})
export class Demo_Avatar_Icon {
  protected readonly icon = tablerUser;
}
