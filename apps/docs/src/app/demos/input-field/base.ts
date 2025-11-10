import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  imports: [FormsModule, NgnInput, NgnInputField],
  selector: 'ngn-demo-input-field-base',
  template: `
    <ngn-input-field [inputId]="'test-input'">
      <input ngnInput [ngModel]="value()" (ngModelChange)="value.set($event)" />
      🥳
    </ngn-input-field>
    {{ value() }}
  `,
})
export class Demo_InputField_Base {
  protected readonly value = signal<string>('');
}
