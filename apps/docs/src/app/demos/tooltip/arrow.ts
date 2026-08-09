import { Component } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdTooltip } from '@awdlab/jig/tooltip';

@Component({
  imports: [AwdButton, AwdTooltip],
  selector: 'jig-demo-tooltip-arrow',
  template: `<button ngnButton [ngnTooltip]="'Hello World!'" [ngnTooltipShowArrow]="true">
      With Arrow
    </button>
    <button ngnButton [ngnTooltip]="'Hello World!'" [ngnTooltipShowArrow]="false">
      Without Arrow
    </button>`,
  styles: `
    :host {
      display: flex;
      gap: 8px;
    }
  `,
})
export class Demo_Tooltip_Arrow {}
