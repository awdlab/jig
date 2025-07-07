import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MASKS, TextField, TextFieldMaskCfg } from '@ngneers/controls/text-field';

@Component({
  imports: [FormsModule, TextField],
  selector: 'ngn-text-field-mask',
  template: `
    <ngn-text-field
      [inputId]="'test-input'"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
      [mask]="mask"
    />
    {{ value() }}
  `,
})
export class TextField_Mask_Component {
  protected readonly value = signal<string>('');
  protected readonly mask: TextFieldMaskCfg = MASKS.time;
}
