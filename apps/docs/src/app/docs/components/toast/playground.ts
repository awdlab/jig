import { Component, viewChild } from '@angular/core';
import { AwdToast } from '@awdlab/jig/toast';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-toast-playground',
  imports: [AwdToast, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdToast', component: component() }]">
      <jig-toast #ref [header]="'Header Text'" [content]="'Content Text'" />
    </jig-docs-playground>
  `,
})
export class AwdDocsToastPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdToast });
}
