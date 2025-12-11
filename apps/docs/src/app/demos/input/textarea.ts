import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput],
  selector: 'ngn-demo-input-textarea',
  template: `
    <textarea
      ngnInput
      rows="3"
      [value]="value()"
      (valueChange)="value.set($event ?? '')"
    ></textarea>
    {{ value() }}
  `,
})
export class Demo_Input_Textarea {
  protected readonly value = signal<string>('');
}
