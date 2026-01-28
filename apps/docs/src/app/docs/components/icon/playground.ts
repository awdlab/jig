import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnIcon } from '@ngneers/controls/icon';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnIcon, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnIcon" [component]="component()">
      <ngn-icon #ref icon="img/icons/user.svg" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsIconPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnIcon });
}
