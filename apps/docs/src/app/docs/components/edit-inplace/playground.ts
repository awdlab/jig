import { Component, signal, viewChild } from '@angular/core';
import { NgnEditInplace } from '@awdlab/jig/edit-inplace';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-edit-inplace-playground',
  imports: [NgnEditInplace, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnEditInplace', component: component() }]">
      <awd-edit-inplace #ref [value]="value()" (valueChange)="value.set($event)" />
    </awd-docs-playground>
  `,
})
export class NgnDocsEditInplacePlayground {
  protected readonly component = viewChild.required('ref', { read: NgnEditInplace });
  protected readonly value = signal('Edit me');
}
