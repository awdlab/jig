import { Component, signal, viewChild } from '@angular/core';
import { AwdEditInplace } from '@awdlab/jig/edit-inplace';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-edit-inplace-playground',
  imports: [AwdEditInplace, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdEditInplace', component: component() }]">
      <jig-edit-inplace #ref [value]="value()" (valueChange)="value.set($event)" />
    </jig-docs-playground>
  `,
})
export class AwdDocsEditInplacePlayground {
  protected readonly component = viewChild.required('ref', { read: AwdEditInplace });
  protected readonly value = signal('Edit me');
}
