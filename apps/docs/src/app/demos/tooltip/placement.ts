import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigTooltip } from '@awdlab/jig/tooltip';

@Component({
  imports: [JigButton, JigTooltip],
  selector: 'jig-demo-tooltip-placement',
  template: `
    <button jigButton [jigTooltip]="content" [jigTooltipPlacement]="'left-start'">
      Left Start
    </button>
    <button jigButton [jigTooltip]="content" [jigTooltipPlacement]="'left'">Left</button>
    <button jigButton [jigTooltip]="content" [jigTooltipPlacement]="'left-end'">Left End</button>

    <button jigButton [jigTooltip]="content" [jigTooltipPlacement]="'top-start'">Top Start</button>
    <button jigButton [jigTooltip]="content" [jigTooltipPlacement]="'top'">Top</button>
    <button jigButton [jigTooltip]="content" [jigTooltipPlacement]="'top-end'">Top End</button>

    <button jigButton [jigTooltip]="content" [jigTooltipPlacement]="'right-start'">
      Right Start
    </button>
    <button jigButton [jigTooltip]="content" [jigTooltipPlacement]="'right'">Right</button>
    <button jigButton [jigTooltip]="content" [jigTooltipPlacement]="'right-end'">Right End</button>

    <button jigButton [jigTooltip]="content" [jigTooltipPlacement]="'bottom-start'">
      Bottom Start
    </button>
    <button jigButton [jigTooltip]="content" [jigTooltipPlacement]="'bottom'">Bottom</button>
    <button jigButton [jigTooltip]="content" [jigTooltipPlacement]="'bottom-end'">
      Bottom End
    </button>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(3, max-content);
      gap: 8px;
    }
  `,
})
export class Demo_Tooltip_Placement {
  protected readonly content = 'This is a tooltip.';
}
