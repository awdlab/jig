import { Component, signal } from '@angular/core';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  imports: [JigInput, JigInputField],
  selector: 'jig-demo-input-field-clear',
  template: `
    <jig-input-field [showClearButton]="true">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      🥳
    </jig-input-field>
    {{ value() }}
  `,
})
export class Demo_InputField_Clear {
  protected readonly value = signal<string>('');
}
