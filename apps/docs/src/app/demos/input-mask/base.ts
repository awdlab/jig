import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { MASKS, NgnInputMask, InputMaskCfg } from '@ngneers/controls/input-mask';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput, NgnInputMask],
  selector: 'ngn-demo-input-mask-base',
  template: `
    <ngn-input-mask [inputId]="'test-input'" [mask]="mask">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-mask>
    {{ value() }}
  `,
})
export class Demo_InputMask_Mask {
  protected readonly value = signal<string>('');
  protected readonly mask: InputMaskCfg = MASKS.time;
}
