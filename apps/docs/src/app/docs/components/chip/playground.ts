import { Component, viewChild } from '@angular/core';
import { JigChip } from '@awdlab/jig/chip';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-chip-playground',
  imports: [JigChip, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigChip', component: component() }]">
      <jig-chip #ref>Chip</jig-chip>
    </jig-docs-playground>
  `,
})
export class JigDocsChipPlayground {
  protected readonly component = viewChild.required('ref', { read: JigChip });
}
