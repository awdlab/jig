import { Component, viewChild } from '@angular/core';
import { JigAvatar } from '@awdlab/jig/avatar';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-avatar-playground',
  imports: [JigAvatar, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigAvatar', component: component() }]">
      <jig-avatar #ref />
    </jig-docs-playground>
  `,
})
export class JigDocsAvatarPlayground {
  protected readonly component = viewChild.required('ref', { read: JigAvatar });
}
