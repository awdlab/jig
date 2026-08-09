import { Component, signal, viewChild } from '@angular/core';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-input-playground',
  imports: [JigInput, JigInputField, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigInput', component: component() }]">
      <jig-input-field>
        <input #ref jigInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      </jig-input-field>
    </jig-docs-playground>
  `,
})
export class JigDocsInputPlayground {
  protected readonly component = viewChild.required('ref', { read: JigInput });
  protected readonly value = signal<string>('');
}
