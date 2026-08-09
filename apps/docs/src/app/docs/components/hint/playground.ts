import { Component, viewChild } from '@angular/core';
import { JigHint } from '@awdlab/jig/hint';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-hint-playground',
  imports: [JigHint, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigHint', component: component() }]">
      <jig-hint #ref>This is a hint</jig-hint>
    </jig-docs-playground>
  `,
})
export class JigDocsHintPlayground {
  protected readonly component = viewChild.required('ref', { read: JigHint });
}
