import { Component } from '@angular/core';
import { AwdToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'jig-demo-toggle-button-fixed-width',
  imports: [AwdToggleButton],
  template: `<jig-toggle-button
    [labelOn]="'A longer label'"
    [labelOff]="'Short'"
    [fixedWidth]="true"
  />`,
})
export class Demo_ToggleButton_FixedWidth {}
