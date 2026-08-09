import { Component, signal } from '@angular/core';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  imports: [NgnInput, NgnInputField],
  selector: 'awd-demo-input-field-base',
  template: `
    <awd-input-field>
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      🥳
    </awd-input-field>
    {{ value() }}
  `,
})
export class Demo_InputField_Base {
  protected readonly value = signal<string>('');
}
