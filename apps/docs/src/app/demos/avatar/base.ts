import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnAvatar } from '@ngneers/controls/avatar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-avatar-base',
  imports: [NgnAvatar],
  template: `<ngn-avatar initials="A" />
    <ngn-avatar initials="AB" color="var(--ngn-color-secondary-default)" />
    <ngn-avatar initials="ABC" />
    <ngn-avatar initials="ABCD" color="var(--ngn-color-secondary-default)" />`,
})
export class Demo_Avatar_Base {}
