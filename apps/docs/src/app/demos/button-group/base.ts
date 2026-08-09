import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigButtonGroup } from '@awdlab/jig/button-group';

@Component({
  selector: 'jig-demo-button-group-base',
  imports: [JigButton, JigButtonGroup],
  template: `<jig-button-group>
    <button jigButton kind="primary">Button A</button>
    <button jigButton kind="primary">Button B</button>
    <button jigButton kind="primary">Button C123</button>
  </jig-button-group>`,
})
export class Demo_ButtonGroup_Base {}
