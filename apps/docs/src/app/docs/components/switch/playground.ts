import { Component, viewChild } from '@angular/core';
import { NgnSwitch } from '@awdlab/jig/switch';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-switch-playground',
  imports: [NgnSwitch, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnSwitch', component: component() }]">
      <awd-switch #ref />
    </awd-docs-playground>
  `,
})
export class NgnDocsSwitchPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSwitch });
}
