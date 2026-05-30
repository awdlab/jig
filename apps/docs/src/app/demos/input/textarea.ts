import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput, NgnInputField],
  selector: 'ngn-demo-input-textarea',
  template: `
    <ngn-input-field>
      <textarea
        ngnInput
        rows="3"
        [value]="value()"
        (valueChange)="value.set($event ?? '')"
      ></textarea>
    </ngn-input-field>
    {{ value() }}
  `,
})
export class Demo_Input_Textarea {
  protected readonly value = signal<string>('');
}
