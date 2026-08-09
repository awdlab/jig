import { Component, signal, viewChild } from '@angular/core';
import { AwdInputField } from '@awdlab/jig/input-field';
import { DATE_TIME_MASKS, AwdMaskInput } from '@awdlab/jig/mask-input';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-mask-input-playground',
  imports: [AwdMaskInput, AwdInputField, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdMaskInput', component: component() }]">
      <jig-input-field>
        <jig-mask-input
          #ref
          [mask]="mask"
          [value]="value()"
          (valueChange)="value.set($event ?? '')"
        />
      </jig-input-field>
    </jig-docs-playground>
  `,
})
export class AwdDocsMaskInputPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdMaskInput });
  protected readonly value = signal<string>('');
  protected readonly mask = DATE_TIME_MASKS.time;
}
