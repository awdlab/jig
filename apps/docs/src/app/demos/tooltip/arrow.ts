import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigTooltip } from '@awdlab/jig/tooltip';

@Component({
  imports: [JigButton, JigTooltip],
  selector: 'jig-demo-tooltip-arrow',
  template: `<button jigButton [jigTooltip]="'Hello World!'" [jigTooltipShowArrow]="true">
      With Arrow
    </button>
    <button jigButton [jigTooltip]="'Hello World!'" [jigTooltipShowArrow]="false">
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
