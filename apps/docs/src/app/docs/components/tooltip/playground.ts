import { Component, viewChild } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdTooltip } from '@awdlab/jig/tooltip';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-tooltip-playground',
  imports: [AwdButton, AwdTooltip, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdTooltip', component: component() }]">
      <button #ref ngnButton [ngnTooltip]="'Tooltip text'">Hover me</button>
    </jig-docs-playground>
  `,
})
export class AwdDocsTooltipPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdTooltip });
}
