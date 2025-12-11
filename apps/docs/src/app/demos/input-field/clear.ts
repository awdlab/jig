import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput, NgnInputField],
  selector: 'ngn-demo-input-field-clear',
  template: `
    <ngn-input-field [inputId]="'test-input'" [showClearButton]="true">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
      🥳
    </ngn-input-field>
    {{ value() }}
  `,
})
export class Demo_InputField_Clear {
  protected readonly value = signal<string>('');
}
