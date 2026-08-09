import { Component, viewChild } from '@angular/core';
import { JigKbd } from '@awdlab/jig/kbd';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-kbd-playground',
  imports: [JigKbd, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigKbd', component: component() }]">
      <jig-kbd #ref shortcut="mod+shift+a" />
    </jig-docs-playground>
  `,
})
export class JigDocsKbdPlayground {
  protected readonly component = viewChild.required('ref', { read: JigKbd });
}
