import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnButtonGroup } from '@ngneers/controls/button-group';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnButton, NgnButtonGroup, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnButtonGroup" [component]="component()">
      <ngn-button-group #ref>
        <button #el kind="primary" ngnButton>Button 1</button>
        <button #el kind="primary" ngnButton>Button 2</button>
        <button #el kind="primary" ngnButton>Button 3</button>
      </ngn-button-group>
    </ngn-docs-playground>
  `,
})
export class NgnDocsButtonGroupPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnButtonGroup });
}
