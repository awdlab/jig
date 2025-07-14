import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnInput } from '@ngneers/controls/input';
import { MASKS, InputMask, TextFieldMaskCfg } from '@ngneers/controls/input-mask';

@Component({
  imports: [FormsModule, NgnInput, InputMask],
  selector: 'ngn-input-mask-demo',
  template: `
    <ngn-input-mask [inputId]="'test-input'" [mask]="mask">
      <input ngnInput [ngModel]="value()" (ngModelChange)="value.set($event)" />
    </ngn-input-mask>
    {{ value() }}
  `,
})
export class TextField_Mask_Component {
  protected readonly value = signal<string>('');
  protected readonly mask: TextFieldMaskCfg = MASKS.time;
}
