import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { DATE_TIME_MASKS, NgnInputMask, type InputMaskCfg } from '@ngneers/controls/input-mask';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput, NgnInputMask, NgnInputField],
  selector: 'ngn-demo-input-mask-time12',
  template: `
    <ngn-input-field [label]="'Time (12h)'" [labelKind]="'on'">
      <ngn-input-mask [mask]="mask">
        <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      </ngn-input-mask>
    </ngn-input-field>
    {{ value() }}
  `,
})
export class Demo_InputMask_Time12 {
  protected readonly value = signal<string>('');
  protected readonly mask: InputMaskCfg = DATE_TIME_MASKS.time12;
}
