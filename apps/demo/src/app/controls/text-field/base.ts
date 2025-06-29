import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField } from '@ngneers/controls/form-field';
import { TextField } from '@ngneers/controls/text-field';

@Component({
  imports: [FormsModule, TextField, FormField],
  template: `
    <!-- <ngn-text-field [label]="'Test Label'" /> -->
    <br /><br />
    <ngn-form-field [label]="'Test Form Field'" [inputId]="'test-input'">
      <ngn-text-field
        [inputId]="'test-input'"
        [ngModel]="value()"
        (ngModelChange)="value.set($event)"
      />
      :)
    </ngn-form-field>
    <br />
    {{ value() }}
  `,
})
export class TextField_Base_Component {
  constructor() {}

  public readonly value = signal<string>('');
}
