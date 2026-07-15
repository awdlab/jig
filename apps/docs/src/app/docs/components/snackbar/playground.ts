import { Component, viewChild } from '@angular/core';
import { NgnSnackbar } from '@ngneers/controls/snackbar';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-snackbar-playground',
  imports: [NgnSnackbar, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnSnackbar', component: component() }]">
      <ngn-snackbar #ref [header]="'Header Text'" [content]="'Content Text'" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsSnackbarPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnSnackbar });
}
