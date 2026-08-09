import { Component, signal, viewChild } from '@angular/core';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-input-playground',
  imports: [AwdInput, AwdInputField, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdInput', component: component() }]">
      <jig-input-field>
        <input #ref ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      </jig-input-field>
    </jig-docs-playground>
  `,
})
export class AwdDocsInputPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdInput });
  protected readonly value = signal<string>('');
}
