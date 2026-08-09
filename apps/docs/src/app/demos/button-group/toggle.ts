import { Component } from '@angular/core';
import { NgnButtonGroup } from '@awdlab/jig/button-group';
import { NgnToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'awd-demo-button-group-toggle',
  imports: [NgnToggleButton, NgnButtonGroup],
  template: `<awd-button-group>
    <awd-toggle-button [fixedWidth]="true" label="Button A" />
    <awd-toggle-button [fixedWidth]="true" label="Button B" />
    <awd-toggle-button [fixedWidth]="true" label="Button C123" />
  </awd-button-group>`,
})
export class Demo_ButtonGroup_Toggle {}
