import { Component, signal, viewChild } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { DATE_TIME_MASKS, NgnMaskInput } from '@ngneers/controls/mask-input';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  imports: [NgnMaskInput, NgnInputField, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnMaskInput', component: component() }]">
      <ngn-input-field>
        <ngn-mask-input
          #ref
          [mask]="mask"
          [value]="value()"
          (valueChange)="value.set($event ?? '')"
        />
      </ngn-input-field>
    </ngn-docs-playground>
  `,
})
export class NgnDocsMaskInputPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnMaskInput });
  protected readonly value = signal<string>('');
  protected readonly mask = DATE_TIME_MASKS.time;
}
