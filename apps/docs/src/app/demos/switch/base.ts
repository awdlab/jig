import { Component } from '@angular/core';
import { JigSwitch } from '@awdlab/jig/switch';

@Component({
  selector: 'jig-demo-switch-base',
  imports: [JigSwitch],
  template: `<jig-switch />`,
})
export class Demo_Switch_Base {}
