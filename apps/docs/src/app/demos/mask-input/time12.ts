import { Component, signal } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { DATE_TIME_MASKS, NgnMaskInput, type MaskInputCfg } from '@ngneers/controls/mask-input';

@Component({
  imports: [NgnMaskInput, NgnInputField],
  selector: 'ngn-demo-mask-input-time12',
  template: `
    <ngn-input-field [label]="'Time (12h)'" [labelKind]="'on'">
      <ngn-mask-input [mask]="mask" [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-field>
    {{ value() }}
  `,
})
export class Demo_MaskInput_Time12 {
  protected readonly value = signal<string>('');
  protected readonly mask: MaskInputCfg = DATE_TIME_MASKS.time12;
}
