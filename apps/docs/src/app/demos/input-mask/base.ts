import { Component, signal } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { DATE_TIME_MASKS, NgnInputMask, type InputMaskCfg } from '@ngneers/controls/input-mask';

@Component({
  imports: [NgnInputMask, NgnInputField],
  selector: 'ngn-demo-input-mask-base',
  template: `
    <ngn-input-field [label]="'Label for input mask'" [labelKind]="'on'">
      <ngn-input-mask [mask]="mask" [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-field>
    {{ value() }}
  `,
})
export class Demo_InputMask_Base {
  protected readonly value = signal<string>('');
  protected readonly mask: InputMaskCfg = DATE_TIME_MASKS.time;
}
