import { Component } from '@angular/core';
import { JigToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  selector: 'jig-demo-toggle-button-base',
  imports: [JigToggleButton],
  template: `<jig-toggle-button label="Toggle Me" />`,
})
export class Demo_ToggleButton_Base {}
