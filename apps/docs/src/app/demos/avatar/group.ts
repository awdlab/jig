import { Component } from '@angular/core';
import { NgnAvatar, NgnAvatarGroup } from '@awdlab/jig/avatar';

@Component({
  selector: 'awd-demo-avatar-group',
  imports: [NgnAvatar, NgnAvatarGroup],
  template: `
    <awd-avatar-group>
      <awd-avatar image="img/avatar/1.png" />
      <awd-avatar image="img/avatar/2.png" />
      <awd-avatar image="img/avatar/3.png" />
      <awd-avatar image="img/avatar/4.png" />
      <awd-avatar image="img/avatar/5.png" />
      <awd-avatar initials="+2" bgColor="var(--awd-color-surface-400)" />
    </awd-avatar-group>
  `,
})
export class Demo_Avatar_Group {}
