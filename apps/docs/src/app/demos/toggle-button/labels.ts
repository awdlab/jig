import { Component } from '@angular/core';
import { AwdToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'jig-demo-toggle-button-labels',
  imports: [AwdToggleButton],
  template: `<jig-toggle-button [labelOn]="'On'" [labelOff]="'Off'" />`,
})
export class Demo_ToggleButton_Labels {}
