import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigTooltip } from '@awdlab/jig/tooltip';

@Component({
  imports: [JigButton, JigTooltip],
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
