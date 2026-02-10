import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnToggleButton } from '@ngneers/controls/toggle-button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-toggle-button-labels',
  imports: [NgnToggleButton],
  template: `<ngn-toggle-button [labelOn]="'On'" [labelOff]="'Off'" />`,
})
export class Demo_ToggleButton_Labels {}
