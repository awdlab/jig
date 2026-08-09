import { Component } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdButtonGroup } from '@awdlab/jig/button-group';

@Component({
  selector: 'jig-demo-button-group-base',
  imports: [AwdButton, AwdButtonGroup],
  template: `<jig-button-group>
    <button ngnButton kind="primary">Button A</button>
    <button ngnButton kind="primary">Button B</button>
    <button ngnButton kind="primary">Button C123</button>
  </jig-button-group>`,
})
export class Demo_ButtonGroup_Base {}
