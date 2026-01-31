import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput, NgnInputField, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnInputField', component: component() }]">
      <ngn-input-field #ref>
        <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      </ngn-input-field>
    </ngn-docs-playground>
  `,
})
export class NgnDocsInputFieldPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnInputField });
  protected readonly value = signal<string>('');
}
