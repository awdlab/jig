import { Component } from '@angular/core';
import { NgnSwitch } from '@awdlab/jig/switch';

@Component({
  selector: 'awd-demo-switch-base',
  imports: [NgnSwitch],
  template: `<awd-switch />`,
})
export class Demo_Switch_Base {}
