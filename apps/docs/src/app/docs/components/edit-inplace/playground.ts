import { Component, signal, viewChild } from '@angular/core';
import { NgnEditInplace } from '@ngneers/controls/edit-inplace';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-edit-inplace-playground',
  imports: [NgnEditInplace, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnEditInplace', component: component() }]">
      <ngn-edit-inplace #ref [value]="value()" (valueChange)="value.set($event)" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsEditInplacePlayground {
  protected readonly component = viewChild.required('ref', { read: NgnEditInplace });
  protected readonly value = signal('Edit me');
}
