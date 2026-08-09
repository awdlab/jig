import { Component, viewChild } from '@angular/core';
import { AwdChip } from '@awdlab/jig/chip';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-chip-playground',
  imports: [AwdChip, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdChip', component: component() }]">
      <jig-chip #ref>Chip</jig-chip>
    </jig-docs-playground>
  `,
})
export class AwdDocsChipPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdChip });
}
