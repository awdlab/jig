import { Component } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnButtonGroup } from '@awdlab/jig/button-group';

@Component({
  selector: 'awd-demo-button-group-base',
  imports: [NgnButton, NgnButtonGroup],
  template: `<awd-button-group>
    <button ngnButton kind="primary">Button A</button>
    <button ngnButton kind="primary">Button B</button>
    <button ngnButton kind="primary">Button C123</button>
  </awd-button-group>`,
})
export class Demo_ButtonGroup_Base {}
