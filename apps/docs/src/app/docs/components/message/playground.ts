import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnMessage } from '@ngneers/controls/message';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnMessage, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnMessage" [component]="component()">
      <ngn-message #ref>This is a message</ngn-message>
    </ngn-docs-playground>
  `,
})
export class NgnDocsMessagePlayground {
  protected readonly component = viewChild.required('ref', { read: NgnMessage });
}
