import { Component, viewChild } from '@angular/core';
import { AwdMessage } from '@awdlab/jig/message';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-message-playground',
  imports: [AwdMessage, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdMessage', component: component() }]">
      <jig-message #ref>This is a message</jig-message>
    </jig-docs-playground>
  `,
})
export class AwdDocsMessagePlayground {
  protected readonly component = viewChild.required('ref', { read: AwdMessage });
}
