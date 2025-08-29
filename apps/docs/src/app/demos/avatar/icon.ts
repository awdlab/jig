import { Component } from '@angular/core';
import { NgnAvatar } from '@ngneers/controls/avatar';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  imports: [NgnAvatar, NgnIcon],
  template: `
    <ngn-avatar>
      <ngn-icon [size]="'48px'" icon="fa fa-user" />
    </ngn-avatar>
  `,
})
export class Demo_Avatar_Icon {}
