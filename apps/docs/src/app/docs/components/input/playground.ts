import { Component, signal, viewChild } from '@angular/core';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-input-playground',
  imports: [NgnInput, NgnInputField, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnInput', component: component() }]">
      <awd-input-field>
        <input #ref ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      </awd-input-field>
    </awd-docs-playground>
  `,
})
export class NgnDocsInputPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnInput });
  protected readonly value = signal<string>('');
}
