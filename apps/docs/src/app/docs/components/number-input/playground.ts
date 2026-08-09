import { Component, signal, viewChild } from '@angular/core';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdNumberInput } from '@awdlab/jig/number-input';
import { AwdSpinButtons } from '@awdlab/jig/spin-buttons';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-number-input-playground',
  imports: [AwdNumberInput, AwdInputField, AwdSpinButtons, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdNumberInput', component: component() }]">
      <jig-input-field>
        <input
          ngnNumberInput
          #ref="ngnNumberInput"
          [value]="value()"
          (valueChange)="value.set($event)"
        />
        <jig-spin-buttons />
      </jig-input-field>
    </jig-docs-playground>
  `,
})
export class AwdDocsNumberInputPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdNumberInput });
  protected readonly value = signal<number | null>(42);
}
