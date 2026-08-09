import { Component } from '@angular/core';
import { AwdButtonGroup } from '@awdlab/jig/button-group';
import { AwdToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'jig-demo-button-group-toggle',
  imports: [AwdToggleButton, AwdButtonGroup],
  template: `<jig-button-group>
    <jig-toggle-button [fixedWidth]="true" label="Button A" />
    <jig-toggle-button [fixedWidth]="true" label="Button B" />
    <jig-toggle-button [fixedWidth]="true" label="Button C123" />
  </jig-button-group>`,
})
export class Demo_ButtonGroup_Toggle {}
