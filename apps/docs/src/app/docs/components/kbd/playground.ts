import { Component, viewChild } from '@angular/core';
import { NgnKbd } from '@awdlab/jig/kbd';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-kbd-playground',
  imports: [NgnKbd, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnKbd', component: component() }]">
      <awd-kbd #ref shortcut="mod+shift+a" />
    </awd-docs-playground>
  `,
})
export class NgnDocsKbdPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnKbd });
}
