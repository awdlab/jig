import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  imports: [FormsModule, NgnInput, NgnInputField],
  selector: 'ngn-demo-input-field-textarea',
  template: `<ngn-input-field [inputId]="'test-input'">
      <textarea
        ngnInput
        rows="3"
        [ngModel]="value()"
        (ngModelChange)="value.set($event)"
      ></textarea>
      🥳
    </ngn-input-field>
    {{ value() }} `,
})
export class Demo_InputField_Textarea {
  protected readonly value = signal<string>('');
}
