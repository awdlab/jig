import { Component, viewChild } from '@angular/core';
import { NgnKbd } from '@ngneers/controls/kbd';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-kbd-playground',
  imports: [NgnKbd, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnKbd', component: component() }]">
      <ngn-kbd #ref shortcut="mod+shift+a" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsKbdPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnKbd });
}
