import { Component, signal } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { DATE_TIME_MASKS, JigMaskInput, type MaskInputCfg } from '@awdlab/jig/mask-input';

@Component({
  imports: [JigMaskInput, JigInputField],
  selector: 'jig-demo-mask-input-base',
  template: `
    <jig-input-field [label]="'Label for input mask'" [labelKind]="'on'">
      <jig-mask-input [mask]="mask" [value]="value()" (valueChange)="value.set($event ?? '')" />
    </jig-input-field>
    {{ value() }}
  `,
})
export class Demo_MaskInput_Base {
  protected readonly value = signal<string>('');
  protected readonly mask: MaskInputCfg = DATE_TIME_MASKS.time;
}
