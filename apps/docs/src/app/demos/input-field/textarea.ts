import { Component, signal } from '@angular/core';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  imports: [NgnInput, NgnInputField],
  selector: 'awd-demo-input-field-textarea',
  template: `<awd-input-field>
      <textarea
        ngnInput
        rows="3"
        [value]="value()"
        (valueChange)="value.set($event ?? '')"
      ></textarea>
      🥳
    </awd-input-field>
    {{ value() }} `,
})
export class Demo_InputField_Textarea {
  protected readonly value = signal<string>('');
}
