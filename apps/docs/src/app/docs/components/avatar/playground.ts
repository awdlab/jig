import { Component, viewChild } from '@angular/core';
import { AwdAvatar } from '@awdlab/jig/avatar';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-avatar-playground',
  imports: [AwdAvatar, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdAvatar', component: component() }]">
      <jig-avatar #ref />
    </jig-docs-playground>
  `,
})
export class AwdDocsAvatarPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdAvatar });
}
