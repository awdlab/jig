import { Component, signal } from '@angular/core';
import { NgnInputField } from '@awdlab/jig/input-field';
import { DATE_TIME_MASKS, NgnMaskInput, type MaskInputCfg } from '@awdlab/jig/mask-input';

@Component({
  imports: [NgnMaskInput, NgnInputField],
  selector: 'awd-demo-mask-input-date',
  template: `
    <awd-input-field [label]="'Date'" [labelKind]="'on'">
      <awd-mask-input [mask]="mask" [value]="value()" (valueChange)="value.set($event ?? '')" />
    </awd-input-field>
    {{ value() }}
  `,
})
export class Demo_MaskInput_Date {
  protected readonly value = signal<string>('');
  protected readonly mask: MaskInputCfg = DATE_TIME_MASKS.date;
}
