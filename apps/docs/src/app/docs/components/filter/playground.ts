import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnFilter } from '@ngneers/controls/filter';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnFilter, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnFilter', component: component() }]">
      <ngn-filter #ref [data]="data" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsFilterPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnFilter });
  protected readonly data: readonly string[] = ['Germany', 'France', 'Italy', 'Spain', 'Sweden'];
}
