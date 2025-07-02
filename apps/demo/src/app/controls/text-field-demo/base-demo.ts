import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextField } from '@ngneers/controls/text-field';

@Component({
  imports: [FormsModule, TextField],
  selector: 'ngn-text-field-base',
  template: `
    <ngn-text-field
      [inputId]="'test-input'"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
    />
    {{ value() }}
  `,
})
export class TextField_Base_Component {
  public readonly value = signal<string>('');
}
