import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { MASKS, NgnInputMask, InputMaskCfg } from '@ngneers/controls/input-mask';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput, NgnInputMask, NgnInputField],
  selector: 'ngn-demo-input-mask-input-field',
  template: `
    <ngn-input-field [label]="'Label for input mask'" [labelKind]="'on'">
      <ngn-input-mask [mask]="mask">
        <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      </ngn-input-mask>
    </ngn-input-field>
    {{ value() }}
  `,
})
export class Demo_InputMask_InputField {
  protected readonly value = signal<string>('');
  protected readonly mask: InputMaskCfg = MASKS.time;
}
