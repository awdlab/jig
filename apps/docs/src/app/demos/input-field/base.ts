import { Component, signal } from '@angular/core';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  imports: [JigInput, JigInputField],
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
