import { Component, viewChild } from '@angular/core';
import { NgnAvatar } from '@awdlab/jig/avatar';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-avatar-playground',
  imports: [NgnAvatar, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnAvatar', component: component() }]">
      <awd-avatar #ref />
    </awd-docs-playground>
  `,
})
export class NgnDocsAvatarPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnAvatar });
}
