import { Component, signal } from '@angular/core';
import { AwdInputField } from '@awdlab/jig/input-field';
import { DATE_TIME_MASKS, AwdMaskInput, type MaskInputCfg } from '@awdlab/jig/mask-input';

@Component({
  imports: [AwdMaskInput, AwdInputField],
  selector: 'jig-demo-mask-input-date',
  template: `
    <jig-input-field [label]="'Date'" [labelKind]="'on'">
      <jig-mask-input [mask]="mask" [value]="value()" (valueChange)="value.set($event ?? '')" />
    </jig-input-field>
    {{ value() }}
  `,
})
export class Demo_MaskInput_Date {
  protected readonly value = signal<string>('');
  protected readonly mask: MaskInputCfg = DATE_TIME_MASKS.date;
}
