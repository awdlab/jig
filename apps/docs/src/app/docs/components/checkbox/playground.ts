import { Component, viewChild } from '@angular/core';
import { JigCheckbox } from '@awdlab/jig/checkbox';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-checkbox-playground',
  imports: [JigCheckbox, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigCheckbox', component: component() }]">
      <jig-checkbox #ref />
    </jig-docs-playground>
  `,
})
export class JigDocsCheckboxPlayground {
  protected readonly component = viewChild.required('ref', { read: JigCheckbox });
}
