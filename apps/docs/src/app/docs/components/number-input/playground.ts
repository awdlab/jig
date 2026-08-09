import { Component, signal, viewChild } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigNumberInput } from '@awdlab/jig/number-input';
import { JigSpinButtons } from '@awdlab/jig/spin-buttons';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-number-input-playground',
  imports: [JigNumberInput, JigInputField, JigSpinButtons, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigNumberInput', component: component() }]">
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
export class JigDocsNumberInputPlayground {
  protected readonly component = viewChild.required('ref', { read: JigNumberInput });
  protected readonly value = signal<number | null>(42);
}
