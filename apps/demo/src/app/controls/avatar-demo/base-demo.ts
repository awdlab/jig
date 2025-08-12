import { Component } from '@angular/core';
import { NgnAvatar } from '@ngneers/controls/avatar';

@Component({
  imports: [NgnAvatar],
  template: `<ngn-avatar initials="A" />
    <ngn-avatar initials="AB" color="var(--ngn-color-secondary-default)" />
    <ngn-avatar initials="ABC" />
    <ngn-avatar initials="ABCD" color="var(--ngn-color-secondary-default)" />`,
})
export class Avatar_Base_Component {}
