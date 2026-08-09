import { Component, viewChild } from '@angular/core';
import { NgnSnackbar } from '@awdlab/jig/snackbar';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-snackbar-playground',
  imports: [NgnSnackbar, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnSnackbar', component: component() }]">
      <awd-snackbar #ref [header]="'Header Text'" [content]="'Content Text'" />
    </awd-docs-playground>
  `,
})
export class NgnDocsSnackbarPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSnackbar });
}
