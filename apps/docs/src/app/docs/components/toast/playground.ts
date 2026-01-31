import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnToast } from '@ngneers/controls/toast';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnToast, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnToast', component: component() }]">
      <ngn-toast #ref [header]="'Header Text'" [content]="'Content Text'" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsToastPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnToast });
}
