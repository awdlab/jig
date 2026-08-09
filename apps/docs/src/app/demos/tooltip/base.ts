import { Component } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdTooltip } from '@awdlab/jig/tooltip';

@Component({
  imports: [AwdButton, AwdTooltip],
  selector: 'jig-demo-tooltip-base',
  template: `<button ngnButton [ngnTooltip]="'Hello World!'">Hello</button>`,
})
export class Demo_Tooltip_Base {}
