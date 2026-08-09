import { Component } from '@angular/core';
import { AwdAvatar, AwdAvatarGroup } from '@awdlab/jig/avatar';

@Component({
  selector: 'jig-demo-avatar-group',
  imports: [AwdAvatar, AwdAvatarGroup],
  template: `
    <jig-avatar-group>
      <jig-avatar image="img/avatar/1.png" />
      <jig-avatar image="img/avatar/2.png" />
      <jig-avatar image="img/avatar/3.png" />
      <jig-avatar image="img/avatar/4.png" />
      <jig-avatar image="img/avatar/5.png" />
      <jig-avatar initials="+2" bgColor="var(--jig-color-surface-400)" />
    </jig-avatar-group>
  `,
})
export class Demo_Avatar_Group {}
