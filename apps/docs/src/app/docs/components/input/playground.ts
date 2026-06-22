import { Component, signal, viewChild } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  imports: [NgnInput, NgnInputField, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnInput', component: component() }]">
      <ngn-input-field>
        <input #ref ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      </ngn-input-field>
    </ngn-docs-playground>
  `,
})
export class NgnDocsInputPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnInput });
  protected readonly value = signal<string>('');
}
