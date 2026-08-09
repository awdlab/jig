import { Component } from '@angular/core';
import { JigToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'jig-demo-toggle-button-fixed-width',
  imports: [JigToggleButton],
  template: `<jig-toggle-button
    [labelOn]="'A longer label'"
    [labelOff]="'Short'"
    [fixedWidth]="true"
  />`,
})
export class Demo_ToggleButton_FixedWidth {}
