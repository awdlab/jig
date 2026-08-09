import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigTooltip } from '@awdlab/jig/tooltip';

@Component({
  imports: [JigButton, JigTooltip],
  selector: 'jig-demo-tooltip-base',
  template: `<button ngnButton [ngnTooltip]="'Hello World!'">Hello</button>`,
})
export class Demo_Tooltip_Base {}
