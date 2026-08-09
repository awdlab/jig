import { Component } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnButtonGroup } from '@awdlab/jig/button-group';

@Component({
  selector: 'awd-demo-button-group-orientation',
  imports: [NgnButton, NgnButtonGroup],
  template: `<div class="flex flex-wrap items-start gap-8">
    <awd-button-group orientation="horizontal">
      <button ngnButton kind="primary">Button A</button>
      <button ngnButton kind="primary">Button B</button>
      <button ngnButton kind="primary">Button C123</button>
    </awd-button-group>
    <awd-button-group orientation="vertical">
      <button ngnButton kind="primary">Button A</button>
      <button ngnButton kind="primary">Button B</button>
      <button ngnButton kind="primary">Button C123</button>
    </awd-button-group>
  </div>`,
})
export class Demo_ButtonGroup_Orientation {}
