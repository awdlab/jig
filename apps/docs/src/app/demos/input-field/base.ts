import { Component, signal } from '@angular/core';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';

@Component({
  imports: [AwdInput, AwdInputField],
  selector: 'jig-demo-input-field-base',
  template: `
    <jig-input-field>
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      🥳
    </jig-input-field>
    {{ value() }}
  `,
})
export class Demo_InputField_Base {
  protected readonly value = signal<string>('');
}
