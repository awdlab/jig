import { Component, signal } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { DATE_TIME_MASKS, NgnMaskInput, type MaskInputCfg } from '@awdlab/jig/mask-input';

@Component({
  imports: [NgnMaskInput, NgnInputField],
  selector: 'awd-demo-mask-input-time12',
  template: `
    <awd-input-field [label]="'Time (12h)'" [labelKind]="'on'">
      <awd-mask-input [mask]="mask" [value]="value()" (valueChange)="value.set($event ?? '')" />
    </awd-input-field>
    {{ value() }}
  `,
})
export class Demo_MaskInput_Time12 {
  protected readonly value = signal<string>('');
  protected readonly mask: MaskInputCfg = DATE_TIME_MASKS.time12;
}
