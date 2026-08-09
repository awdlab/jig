import { Component, signal, viewChild } from '@angular/core';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-input-field-playground',
  imports: [AwdInput, AwdInputField, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdInputField', component: component() }]">
      <jig-input-field #ref>
        <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      </jig-input-field>
    </jig-docs-playground>
  `,
})
export class AwdDocsInputFieldPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdInputField });
  protected readonly value = signal<string>('');
}
