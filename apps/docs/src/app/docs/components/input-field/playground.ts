import { Component, signal, viewChild } from '@angular/core';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-input-field-playground',
  imports: [NgnInput, NgnInputField, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnInputField', component: component() }]">
      <awd-input-field #ref>
        <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      </awd-input-field>
    </awd-docs-playground>
  `,
})
export class NgnDocsInputFieldPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnInputField });
  protected readonly value = signal<string>('');
}
