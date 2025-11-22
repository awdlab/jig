import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnAvatar, NgnAvatarGroup } from '@ngneers/controls/avatar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-avatar-group',
  imports: [NgnAvatar, NgnAvatarGroup],
  template: `
    <ngn-avatar-group>
      <ngn-avatar image="img/avatar/1.png" />
      <ngn-avatar image="img/avatar/2.png" />
      <ngn-avatar image="img/avatar/3.png" />
      <ngn-avatar image="img/avatar/4.png" />
      <ngn-avatar image="img/avatar/5.png" />
      <ngn-avatar initials="+2" color="var(--ngn-color-surface-400)" />
    </ngn-avatar-group>
  `,
})
export class Demo_Avatar_Group {}
