import { Component, viewChild } from '@angular/core';
import { NgnAvatar } from '@ngneers/controls/avatar';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-avatar-playground',
  imports: [NgnAvatar, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnAvatar', component: component() }]">
      <ngn-avatar #ref />
    </ngn-docs-playground>
  `,
})
export class NgnDocsAvatarPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnAvatar });
}
