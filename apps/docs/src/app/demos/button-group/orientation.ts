import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigButtonGroup } from '@awdlab/jig/button-group';

@Component({
  selector: 'jig-demo-button-group-orientation',
  imports: [JigButton, JigButtonGroup],
  template: `<div class="flex flex-wrap items-start gap-8">
    <jig-button-group orientation="horizontal">
      <button jigButton kind="primary">Button A</button>
      <button jigButton kind="primary">Button B</button>
      <button jigButton kind="primary">Button C123</button>
    </jig-button-group>
    <jig-button-group orientation="vertical">
      <button jigButton kind="primary">Button A</button>
      <button jigButton kind="primary">Button B</button>
      <button jigButton kind="primary">Button C123</button>
    </jig-button-group>
  </div>`,
})
export class Demo_ButtonGroup_Orientation {}
