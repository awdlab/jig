import { Component } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnTooltip } from '@awdlab/jig/tooltip';

@Component({
  imports: [NgnButton, NgnTooltip],
  selector: 'awd-demo-tooltip-base',
  template: `<button ngnButton [ngnTooltip]="'Hello World!'">Hello</button>`,
})
export class Demo_Tooltip_Base {}
