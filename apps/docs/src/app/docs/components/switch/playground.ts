import { Component, viewChild } from '@angular/core';
import { AwdSwitch } from '@awdlab/jig/switch';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-switch-playground',
  imports: [AwdSwitch, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdSwitch', component: component() }]">
      <jig-switch #ref />
    </jig-docs-playground>
  `,
})
export class AwdDocsSwitchPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdSwitch });
}
