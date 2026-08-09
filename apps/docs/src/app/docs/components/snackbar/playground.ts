import { Component, viewChild } from '@angular/core';
import { JigSnackbar } from '@awdlab/jig/snackbar';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-snackbar-playground',
  imports: [JigSnackbar, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigSnackbar', component: component() }]">
      <jig-snackbar #ref [header]="'Header Text'" [content]="'Content Text'" />
    </jig-docs-playground>
  `,
})
export class JigDocsSnackbarPlayground {
  protected readonly component = viewChild.required('ref', { read: JigSnackbar });
}
