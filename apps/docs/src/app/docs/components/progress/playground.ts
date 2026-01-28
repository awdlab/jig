import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { NgnProgress } from '@ngneers/controls/progress';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnProgress, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnProgress" [component]="component()">
      <ngn-progress #ref [value]="value()" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsProgressPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnProgress });
  protected readonly value = signal(50);
}
