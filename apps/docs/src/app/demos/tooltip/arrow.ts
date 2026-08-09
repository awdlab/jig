import { Component } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnTooltip } from '@awdlab/jig/tooltip';

@Component({
  imports: [NgnButton, NgnTooltip],
  selector: 'awd-demo-tooltip-arrow',
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
