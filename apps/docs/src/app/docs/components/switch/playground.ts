import { Component, viewChild } from '@angular/core';
import { NgnSwitch } from '@ngneers/controls/switch';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-switch-playground',
  imports: [NgnSwitch, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnSwitch', component: component() }]">
      <ngn-switch #ref />
    </ngn-docs-playground>
  `,
})
export class NgnDocsSwitchPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSwitch });
}
