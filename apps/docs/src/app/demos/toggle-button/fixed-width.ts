import { Component } from '@angular/core';
import { NgnToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'awd-demo-toggle-button-fixed-width',
  imports: [NgnToggleButton],
  template: `<awd-toggle-button
    [labelOn]="'A longer label'"
    [labelOff]="'Short'"
    [fixedWidth]="true"
  />`,
})
export class Demo_ToggleButton_FixedWidth {}
