import { Component, signal } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  imports: [NgnInput, NgnInputField],
  selector: 'ngn-demo-input-base',
  template: `
    <ngn-input-field>
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-field>
    {{ value() }}
  `,
})
export class Demo_Input_Base {
  protected readonly value = signal<string>('');
}
