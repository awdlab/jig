import { Component } from '@angular/core';
import { NgnAvatar } from '@ngneers/controls/avatar';

@Component({
  imports: [NgnAvatar],
  template: ` <ngn-avatar initials="A" />
    <br />
    <ngn-avatar initials="AB" />
    <br />
    <ngn-avatar initials="ABC" />
    <br />
    <ngn-avatar initials="ABCD" />`,
})
export class Avatar_Base_Component {}
