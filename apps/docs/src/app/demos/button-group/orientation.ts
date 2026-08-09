import { Component } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdButtonGroup } from '@awdlab/jig/button-group';

@Component({
  selector: 'jig-demo-button-group-orientation',
  imports: [AwdButton, AwdButtonGroup],
  template: `<div class="flex flex-wrap items-start gap-8">
    <jig-button-group orientation="horizontal">
      <button ngnButton kind="primary">Button A</button>
      <button ngnButton kind="primary">Button B</button>
      <button ngnButton kind="primary">Button C123</button>
    </jig-button-group>
    <jig-button-group orientation="vertical">
      <button ngnButton kind="primary">Button A</button>
      <button ngnButton kind="primary">Button B</button>
      <button ngnButton kind="primary">Button C123</button>
    </jig-button-group>
  </div>`,
})
export class Demo_ButtonGroup_Orientation {}
