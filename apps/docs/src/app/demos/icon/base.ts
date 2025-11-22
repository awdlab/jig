import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnIcon],
  selector: 'ngn-demo-icon-base',
  template: ` <ngn-icon icon="img/icons/user.svg" /> `,
})
export class Demo_Icon_Base {}
