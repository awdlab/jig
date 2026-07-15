import { Component, viewChild } from '@angular/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-checkbox-playground',
  imports: [NgnCheckbox, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnCheckbox', component: component() }]">
      <ngn-checkbox #ref />
    </ngn-docs-playground>
  `,
})
export class NgnDocsCheckboxPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnCheckbox });
}
