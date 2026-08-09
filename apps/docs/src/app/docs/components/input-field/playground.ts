import { Component, signal, viewChild } from '@angular/core';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-input-field-playground',
  imports: [JigInput, JigInputField, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigInputField', component: component() }]">
      <jig-input-field #ref>
        <input jigInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      </jig-input-field>
    </jig-docs-playground>
  `,
})
export class JigDocsInputFieldPlayground {
  protected readonly component = viewChild.required('ref', { read: JigInputField });
  protected readonly value = signal<string>('');
}
