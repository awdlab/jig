import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnButton, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnButton" [component]="component()">
      <button #ref ngnButton>
        @if (component().appliedKind() === 'icon') {
          👽
        } @else {
          A button
        }
      </button>
    </ngn-docs-playground>
  `,
})
export class NgnDocsButtonPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnButton });
}
