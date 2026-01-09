import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput, NgnInputField],
  selector: 'ngn-demo-input-field-label',
  template: `
    <ngn-input-field [label]="'test'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      🥳
    </ngn-input-field>
    {{ value() }}
  `,
})
export class Demo_InputField_Label {
  protected readonly value = signal<string>('');
}
