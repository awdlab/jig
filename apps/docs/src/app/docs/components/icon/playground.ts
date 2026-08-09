import { Component, viewChild } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { AwdIcon } from '@awdlab/jig/icon';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-icon-playground',
  imports: [AwdIcon, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdIcon', component: component() }]">
      <jig-icon #ref [icon]="icon" />
    </jig-docs-playground>
  `,
})
export class AwdDocsIconPlayground {
  protected readonly icon = tablerUser;
  protected readonly component = viewChild.required('ref', { read: AwdIcon });
}
