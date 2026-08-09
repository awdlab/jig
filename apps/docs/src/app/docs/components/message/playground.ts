import { Component, viewChild } from '@angular/core';
import { NgnMessage } from '@awdlab/jig/message';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-message-playground',
  imports: [NgnMessage, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnMessage', component: component() }]">
      <awd-message #ref>This is a message</awd-message>
    </awd-docs-playground>
  `,
})
export class NgnDocsMessagePlayground {
  protected readonly component = viewChild.required('ref', { read: NgnMessage });
}
