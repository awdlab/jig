import { Component, viewChild } from '@angular/core';
import { AwdKbd } from '@awdlab/jig/kbd';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-kbd-playground',
  imports: [AwdKbd, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdKbd', component: component() }]">
      <jig-kbd #ref shortcut="mod+shift+a" />
    </jig-docs-playground>
  `,
})
export class AwdDocsKbdPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdKbd });
}
