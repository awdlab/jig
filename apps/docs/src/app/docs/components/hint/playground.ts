import { Component, viewChild } from '@angular/core';
import { NgnHint } from '@awdlab/jig/hint';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-hint-playground',
  imports: [NgnHint, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnHint', component: component() }]">
      <awd-hint #ref>This is a hint</awd-hint>
    </awd-docs-playground>
  `,
})
export class NgnDocsHintPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnHint });
}
