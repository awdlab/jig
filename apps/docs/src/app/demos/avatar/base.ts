import { Component } from '@angular/core';
import { JigAvatar } from '@awdlab/jig/avatar';

@Component({
  selector: 'jig-demo-avatar-base',
  imports: [JigAvatar],
  template: `<jig-avatar initials="A" />
    <jig-avatar initials="AB" bgColor="var(--jig-color-secondary-default)" />
    <jig-avatar initials="ABC" />
    <jig-avatar initials="ABCD" bgColor="var(--jig-color-secondary-default)" />`,
})
export class Demo_Avatar_Base {}
