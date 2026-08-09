import { Component, signal, viewChild } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { DATE_TIME_MASKS, NgnMaskInput } from '@awdlab/jig/mask-input';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-mask-input-playground',
  imports: [NgnMaskInput, NgnInputField, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnMaskInput', component: component() }]">
      <awd-input-field>
        <awd-mask-input
          #ref
          [mask]="mask"
          [value]="value()"
          (valueChange)="value.set($event ?? '')"
        />
      </awd-input-field>
    </awd-docs-playground>
  `,
})
export class NgnDocsMaskInputPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnMaskInput });
  protected readonly value = signal<string>('');
  protected readonly mask = DATE_TIME_MASKS.time;
}
