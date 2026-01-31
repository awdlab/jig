import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { MASKS, NgnInputMask } from '@ngneers/controls/input-mask';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput, NgnInputMask, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnInputMask', component: component() }]">
      <ngn-input-mask #ref [mask]="mask">
        <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      </ngn-input-mask>
    </ngn-docs-playground>
  `,
})
export class NgnDocsInputMaskPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnInputMask });
  protected readonly value = signal<string>('');
  protected readonly mask = MASKS.time;
}
