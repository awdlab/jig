import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnTooltip } from '@ngneers/controls/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnButton, NgnTooltip],
  selector: 'ngn-demo-tooltip-base',
  template: `<button ngnButton [ngnTooltip]="'Hello World!'">Hello</button>`,
})
export class Demo_Tooltip_Base {}
