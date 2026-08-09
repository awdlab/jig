import { Component, viewChild } from '@angular/core';
import { AwdCheckbox } from '@awdlab/jig/checkbox';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-checkbox-playground',
  imports: [AwdCheckbox, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdCheckbox', component: component() }]">
      <jig-checkbox #ref />
    </jig-docs-playground>
  `,
})
export class AwdDocsCheckboxPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdCheckbox });
}
