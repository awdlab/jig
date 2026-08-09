import { Component, signal, viewChild } from '@angular/core';
import { JigEditInplace } from '@awdlab/jig/edit-inplace';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-edit-inplace-playground',
  imports: [JigEditInplace, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigEditInplace', component: component() }]">
      <jig-edit-inplace #ref [value]="value()" (valueChange)="value.set($event)" />
    </jig-docs-playground>
  `,
})
export class JigDocsEditInplacePlayground {
  protected readonly component = viewChild.required('ref', { read: JigEditInplace });
  protected readonly value = signal('Edit me');
}
