import { Component, viewChild } from '@angular/core';
import { NgnToast } from '@awdlab/jig/toast';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-toast-playground',
  imports: [NgnToast, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnToast', component: component() }]">
      <awd-toast #ref [header]="'Header Text'" [content]="'Content Text'" />
    </awd-docs-playground>
  `,
})
export class NgnDocsToastPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnToast });
}
