import { Component, viewChild } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { JigIcon } from '@awdlab/jig/icon';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-icon-playground',
  imports: [JigIcon, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigIcon', component: component() }]">
      <jig-icon #ref [icon]="icon" />
    </jig-docs-playground>
  `,
})
export class JigDocsIconPlayground {
  protected readonly icon = tablerUser;
  protected readonly component = viewChild.required('ref', { read: JigIcon });
}
