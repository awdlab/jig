import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnTooltip } from '@ngneers/controls/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnButton, NgnTooltip],
  selector: 'ngn-demo-tooltip-placement',
  template: `
    <button ngnButton [ngnTooltip]="content" [ngnTooltipPlacement]="'left-start'">
      Left Start
    </button>
    <button ngnButton [ngnTooltip]="content" [ngnTooltipPlacement]="'left'">Left</button>
    <button ngnButton [ngnTooltip]="content" [ngnTooltipPlacement]="'left-end'">Left End</button>

    <button ngnButton [ngnTooltip]="content" [ngnTooltipPlacement]="'top-start'">Top Start</button>
    <button ngnButton [ngnTooltip]="content" [ngnTooltipPlacement]="'top'">Top</button>
    <button ngnButton [ngnTooltip]="content" [ngnTooltipPlacement]="'top-end'">Top End</button>

    <button ngnButton [ngnTooltip]="content" [ngnTooltipPlacement]="'right-start'">
      Right Start
    </button>
    <button ngnButton [ngnTooltip]="content" [ngnTooltipPlacement]="'right'">Right</button>
    <button ngnButton [ngnTooltip]="content" [ngnTooltipPlacement]="'right-end'">Right End</button>

    <button ngnButton [ngnTooltip]="content" [ngnTooltipPlacement]="'bottom-start'">
      Bottom Start
    </button>
    <button ngnButton [ngnTooltip]="content" [ngnTooltipPlacement]="'bottom'">Bottom</button>
    <button ngnButton [ngnTooltip]="content" [ngnTooltipPlacement]="'bottom-end'">
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
