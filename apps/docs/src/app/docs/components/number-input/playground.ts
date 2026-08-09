import { Component, signal, viewChild } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnNumberInput } from '@awdlab/jig/number-input';
import { NgnSpinButtons } from '@awdlab/jig/spin-buttons';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-number-input-playground',
  imports: [NgnNumberInput, NgnInputField, NgnSpinButtons, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnNumberInput', component: component() }]">
      <awd-input-field>
        <input
          ngnNumberInput
          #ref="ngnNumberInput"
          [value]="value()"
          (valueChange)="value.set($event)"
        />
        <awd-spin-buttons />
      </awd-input-field>
    </awd-docs-playground>
  `,
})
export class NgnDocsNumberInputPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnNumberInput });
  protected readonly value = signal<number | null>(42);
}
