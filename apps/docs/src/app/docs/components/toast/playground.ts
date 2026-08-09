import { Component, viewChild } from '@angular/core';
import { JigToast } from '@awdlab/jig/toast';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-toast-playground',
  imports: [JigToast, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigToast', component: component() }]">
      <jig-toast #ref [header]="'Header Text'" [content]="'Content Text'" />
    </jig-docs-playground>
  `,
})
export class JigDocsToastPlayground {
  protected readonly component = viewChild.required('ref', { read: JigToast });
}
