import { Component } from '@angular/core';
import { NgnButtonGroup } from '@ngneers/controls/button-group';
import { NgnToggleButton } from '@ngneers/controls/toggle-button';

@Component({
  selector: 'ngn-demo-button-group-toggle',
  imports: [NgnToggleButton, NgnButtonGroup],
  template: `<ngn-button-group>
    <ngn-toggle-button [fixedWidth]="true" label="Button A" />
    <ngn-toggle-button [fixedWidth]="true" label="Button B" />
    <ngn-toggle-button [fixedWidth]="true" label="Button C123" />
  </ngn-button-group>`,
})
export class Demo_ButtonGroup_Toggle {}
