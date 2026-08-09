import { Component, viewChild } from '@angular/core';
import { NgnCheckbox } from '@awdlab/jig/checkbox';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-checkbox-playground',
  imports: [NgnCheckbox, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnCheckbox', component: component() }]">
      <awd-checkbox #ref />
    </awd-docs-playground>
  `,
})
export class NgnDocsCheckboxPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnCheckbox });
}
