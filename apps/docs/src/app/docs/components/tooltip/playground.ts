import { Component, viewChild } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigTooltip } from '@awdlab/jig/tooltip';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-tooltip-playground',
  imports: [JigButton, JigTooltip, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigTooltip', component: component() }]">
      <button #ref jigButton [jigTooltip]="'Tooltip text'">Hover me</button>
    </jig-docs-playground>
  `,
})
export class JigDocsTooltipPlayground {
  protected readonly component = viewChild.required('ref', { read: JigTooltip });
}
