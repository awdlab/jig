import { Component, viewChild } from '@angular/core';
import { JigMessage } from '@awdlab/jig/message';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-message-playground',
  imports: [JigMessage, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigMessage', component: component() }]">
      <jig-message #ref>This is a message</jig-message>
    </jig-docs-playground>
  `,
})
export class JigDocsMessagePlayground {
  protected readonly component = viewChild.required('ref', { read: JigMessage });
}
