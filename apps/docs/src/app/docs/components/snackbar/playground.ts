import { Component, viewChild } from '@angular/core';
import { AwdSnackbar } from '@awdlab/jig/snackbar';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-snackbar-playground',
  imports: [AwdSnackbar, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdSnackbar', component: component() }]">
      <jig-snackbar #ref [header]="'Header Text'" [content]="'Content Text'" />
    </jig-docs-playground>
  `,
})
export class AwdDocsSnackbarPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdSnackbar });
}
