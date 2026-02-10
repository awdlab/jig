import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnToggleButton } from '@ngneers/controls/toggle-button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-toggle-button-fixed-width',
  imports: [NgnToggleButton],
  template: `<ngn-toggle-button
    [labelOn]="'A longer label'"
    [labelOff]="'Short'"
    [fixedWidth]="true"
  />`,
})
export class Demo_ToggleButton_FixedWidth {}
