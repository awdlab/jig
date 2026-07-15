import { Component, viewChild } from '@angular/core';
import { NgnHint } from '@ngneers/controls/hint';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-hint-playground',
  imports: [NgnHint, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnHint', component: component() }]">
      <ngn-hint #ref>This is a hint</ngn-hint>
    </ngn-docs-playground>
  `,
})
export class NgnDocsHintPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnHint });
}
