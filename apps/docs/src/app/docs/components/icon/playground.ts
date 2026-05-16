import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnIcon } from '@ngneers/controls/icon';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnIcon, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnIcon', component: component() }]">
      <ngn-icon #ref [icon]="icon" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsIconPlayground {
  protected readonly icon = tablerUser;
  protected readonly component = viewChild.required('ref', { read: NgnIcon });
}
