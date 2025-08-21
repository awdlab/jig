import { Component } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnTooltip } from '@ngneers/controls/tooltip';

@Component({
  imports: [NgnButton, NgnTooltip],
  selector: 'ngn-tooltip-arrow',
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
