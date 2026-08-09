import { Component, viewChild } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnTooltip } from '@awdlab/jig/tooltip';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-tooltip-playground',
  imports: [NgnButton, NgnTooltip, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnTooltip', component: component() }]">
      <button #ref ngnButton [ngnTooltip]="'Tooltip text'">Hover me</button>
    </awd-docs-playground>
  `,
})
export class NgnDocsTooltipPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnTooltip });
}
