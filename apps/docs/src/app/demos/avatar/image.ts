import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnAvatar } from '@ngneers/controls/avatar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-avatar-image',
  imports: [NgnAvatar],
  template: `<ngn-avatar image="img/avatar/1.png" />`,
})
export class Demo_Avatar_Image {}
