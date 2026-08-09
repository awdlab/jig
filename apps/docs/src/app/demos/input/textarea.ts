import { Component, signal } from '@angular/core';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';

@Component({
  imports: [AwdInput, AwdInputField],
  selector: 'jig-demo-input-textarea',
  template: `
    <jig-input-field>
      <textarea
        ngnInput
        rows="3"
        [value]="value()"
        (valueChange)="value.set($event ?? '')"
      ></textarea>
    </jig-input-field>
    {{ value() }}
  `,
})
export class Demo_Input_Textarea {
  protected readonly value = signal<string>('');
}
