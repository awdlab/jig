import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnSwitch } from '@ngneers/controls/switch';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-switch-base',
  imports: [NgnSwitch],
  template: `<ngn-switch />`,
})
export class Demo_Switch_Base {}
