import { Component, signal, viewChild } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { DATE_TIME_MASKS, JigMaskInput } from '@awdlab/jig/mask-input';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-mask-input-playground',
  imports: [JigMaskInput, JigInputField, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigMaskInput', component: component() }]">
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
export class JigDocsMaskInputPlayground {
  protected readonly component = viewChild.required('ref', { read: JigMaskInput });
  protected readonly value = signal<string>('');
  protected readonly mask = DATE_TIME_MASKS.time;
}
