import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnAvatar } from '@ngneers/controls/avatar';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-avatar-icon',
  imports: [NgnAvatar, NgnIcon],
  template: `
    <ngn-avatar>
      <ngn-icon icon="img/icons/user.svg" />
    </ngn-avatar>
  `,
})
export class Demo_Avatar_Icon {}
