import { Component } from '@angular/core';
import { AwdSwitch } from '@awdlab/jig/switch';

@Component({
  selector: 'jig-demo-switch-base',
  imports: [AwdSwitch],
  template: `<jig-switch />`,
})
export class Demo_Switch_Base {}
