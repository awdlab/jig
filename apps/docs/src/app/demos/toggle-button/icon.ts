import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnToggleButton } from '@ngneers/controls/toggle-button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-toggle-button-icon',
  imports: [NgnToggleButton],
  template: `<ngn-toggle-button
    [iconOn]="'img/icons/code.svg'"
    [labelOn]="'Code'"
    [iconOff]="'img/icons/bars.svg'"
  />`,
})
export class Demo_ToggleButton_Icon {}
