import { Component, signal, viewChild } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnNumberInput } from '@ngneers/controls/number-input';
import { NgnSpinButtons } from '@ngneers/controls/spin-buttons';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-number-input-playground',
  imports: [NgnNumberInput, NgnInputField, NgnSpinButtons, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnNumberInput', component: component() }]">
      <ngn-input-field>
        <input
          ngnNumberInput
          #ref="ngnNumberInput"
          [value]="value()"
          (valueChange)="value.set($event)"
        />
        <ngn-spin-buttons />
      </ngn-input-field>
    </ngn-docs-playground>
  `,
})
export class NgnDocsNumberInputPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnNumberInput });
  protected readonly value = signal<number | null>(42);
}
