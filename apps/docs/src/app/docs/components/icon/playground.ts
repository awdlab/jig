import { Component, viewChild } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnIcon } from '@awdlab/jig/icon';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-icon-playground',
  imports: [NgnIcon, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnIcon', component: component() }]">
      <awd-icon #ref [icon]="icon" />
    </awd-docs-playground>
  `,
})
export class NgnDocsIconPlayground {
  protected readonly icon = tablerUser;
  protected readonly component = viewChild.required('ref', { read: NgnIcon });
}
