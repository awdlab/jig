import { Component, viewChild } from '@angular/core';
import { NgnMessage } from '@ngneers/controls/message';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-message-playground',
  imports: [NgnMessage, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnMessage', component: component() }]">
      <ngn-message #ref>This is a message</ngn-message>
    </ngn-docs-playground>
  `,
})
export class NgnDocsMessagePlayground {
  protected readonly component = viewChild.required('ref', { read: NgnMessage });
}
