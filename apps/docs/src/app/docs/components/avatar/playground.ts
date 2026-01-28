import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnAvatar } from '@ngneers/controls/avatar';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnAvatar, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnAvatar" [component]="component()">
      <ngn-avatar #ref />
    </ngn-docs-playground>
  `,
})
export class NgnDocsAvatarPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnAvatar });
}
