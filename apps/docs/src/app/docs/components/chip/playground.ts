import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnChip } from '@ngneers/controls/chip';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnChip, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnChip" [component]="component()">
      <ngn-chip #ref>Chip</ngn-chip>
    </ngn-docs-playground>
  `,
})
export class NgnDocsChipPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnChip });
}
