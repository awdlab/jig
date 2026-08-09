import { Component, viewChild } from '@angular/core';
import { NgnChip } from '@awdlab/jig/chip';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-chip-playground',
  imports: [NgnChip, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnChip', component: component() }]">
      <awd-chip #ref>Chip</awd-chip>
    </awd-docs-playground>
  `,
})
export class NgnDocsChipPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnChip });
}
