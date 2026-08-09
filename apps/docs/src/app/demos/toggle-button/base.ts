import { Component } from '@angular/core';
import { NgnToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'awd-demo-toggle-button-base',
  imports: [NgnToggleButton],
  template: `<awd-toggle-button label="Toggle Me" />`,
})
export class Demo_ToggleButton_Base {}
