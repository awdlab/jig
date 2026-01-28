import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnInput" [component]="component()">
      <input #ref ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsInputPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnInput });
  protected readonly value = signal<string>('');
}
