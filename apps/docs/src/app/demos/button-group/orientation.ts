import { Component } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnButtonGroup } from '@ngneers/controls/button-group';

@Component({
  selector: 'ngn-demo-button-group-orientation',
  imports: [NgnButton, NgnButtonGroup],
  template: `<div class="flex flex-wrap items-start gap-8">
    <ngn-button-group orientation="horizontal">
      <button ngnButton kind="primary">Button A</button>
      <button ngnButton kind="primary">Button B</button>
      <button ngnButton kind="primary">Button C123</button>
    </ngn-button-group>
    <ngn-button-group orientation="vertical">
      <button ngnButton kind="primary">Button A</button>
      <button ngnButton kind="primary">Button B</button>
      <button ngnButton kind="primary">Button C123</button>
    </ngn-button-group>
  </div>`,
})
export class Demo_ButtonGroup_Orientation {}
