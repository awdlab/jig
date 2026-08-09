import { Component } from '@angular/core';
import { NgnAvatar } from '@awdlab/jig/avatar';

@Component({
  selector: 'awd-demo-avatar-base',
  imports: [NgnAvatar],
  template: `<awd-avatar initials="A" />
    <awd-avatar initials="AB" bgColor="var(--awd-color-secondary-default)" />
    <awd-avatar initials="ABC" />
    <awd-avatar initials="ABCD" bgColor="var(--awd-color-secondary-default)" />`,
})
export class Demo_Avatar_Base {}
