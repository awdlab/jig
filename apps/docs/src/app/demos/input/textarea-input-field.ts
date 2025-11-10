import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  imports: [FormsModule, NgnInput, NgnInputField],
  selector: 'ngn-demo-input-textarea-input-field',
  template: `<ngn-input-field [inputId]="'test-input'">
      <textarea ngnInput [ngModel]="value()" (ngModelChange)="value.set($event)"></textarea>
      🥳
    </ngn-input-field>
    {{ value() }} `,
})
export class Demo_Input_TextareaInputField {
  protected readonly value = signal<string>('');
}
