import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnTooltip } from '@ngneers/controls/tooltip';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnButton, NgnTooltip, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnTooltip" [component]="component()">
      <button #ref ngnButton [ngnTooltip]="'Tooltip text'">Hover me</button>
    </ngn-docs-playground>
  `,
})
export class NgnDocsTooltipPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnTooltip });
}
