import { Component, viewChild } from '@angular/core';
import { JigSwitch } from '@awdlab/jig/switch';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-switch-playground',
  imports: [JigSwitch, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigSwitch', component: component() }]">
      <jig-switch #ref />
    </jig-docs-playground>
  `,
})
export class JigDocsSwitchPlayground {
  protected readonly component = viewChild.required('ref', { read: JigSwitch });
}
