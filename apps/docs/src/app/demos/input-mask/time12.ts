import { Component, signal } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { DATE_TIME_MASKS, NgnInputMask, type InputMaskCfg } from '@ngneers/controls/input-mask';

@Component({
  imports: [NgnInputMask, NgnInputField],
  selector: 'ngn-demo-input-mask-time12',
  template: `
    <ngn-input-field [label]="'Time (12h)'" [labelKind]="'on'">
      <ngn-input-mask [mask]="mask" [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-field>
    {{ value() }}
  `,
})
export class Demo_InputMask_Time12 {
  protected readonly value = signal<string>('');
  protected readonly mask: InputMaskCfg = DATE_TIME_MASKS.time12;
}
