import { Component } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnTooltip } from '@ngneers/controls/tooltip';

@Component({
  imports: [NgnButton, NgnTooltip],
  selector: 'ngn-tooltip-base',
  template: `<button ngnButton [ngnTooltip]="'Hello World!'">Hello</button>`,
})
export class Demo_Tooltip_Base {}
