import { Component, viewChild } from '@angular/core';
import { AwdHint } from '@awdlab/jig/hint';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-hint-playground',
  imports: [AwdHint, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdHint', component: component() }]">
      <jig-hint #ref>This is a hint</jig-hint>
    </jig-docs-playground>
  `,
})
export class AwdDocsHintPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdHint });
}
