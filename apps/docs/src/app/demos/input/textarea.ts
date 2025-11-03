import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnInput } from '@ngneers/controls/input';

@Component({
  imports: [FormsModule, NgnInput],
  selector: 'ngn-text-field-textarea',
  template: `
    <textarea ngnInput [ngModel]="value()" (ngModelChange)="value.set($event)"></textarea>
    {{ value() }}
  `,
})
export class Demo_Input_Textarea {
  protected readonly value = signal<string>('');
}
