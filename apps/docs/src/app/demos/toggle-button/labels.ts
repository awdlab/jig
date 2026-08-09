import { Component } from '@angular/core';
import { NgnToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'awd-demo-toggle-button-labels',
  imports: [NgnToggleButton],
  template: `<awd-toggle-button [labelOn]="'On'" [labelOff]="'Off'" />`,
})
export class Demo_ToggleButton_Labels {}
