import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnSwitch } from '@ngneers/controls/switch';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSwitch, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnSwitch" [component]="component()">
      <ngn-switch #ref />
    </ngn-docs-playground>
  `,
})
export class NgnDocsSwitchPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSwitch });
}
