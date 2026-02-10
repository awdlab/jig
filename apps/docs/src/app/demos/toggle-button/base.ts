import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnToggleButton } from '@ngneers/controls/toggle-button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-toggle-button-base',
  imports: [NgnToggleButton],
  template: `<ngn-toggle-button label="Toggle Me" />`,
})
export class Demo_ToggleButton_Base {}
