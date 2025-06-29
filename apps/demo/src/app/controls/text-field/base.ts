import { Component } from '@angular/core';
import { FormField } from '@ngneers/controls/form-field';
import { TextField } from '@ngneers/controls/text-field';

@Component({
  imports: [TextField, FormField],
  template: `
    <!-- <ngn-text-field [label]="'Test Label'" /> -->
    <br /><br />
    <ngn-form-field [label]="'Test Form Field'" [inputId]="'test-input'">
      <ngn-text-field [inputId]="'test-input'" />
      :)
    </ngn-form-field>
  `,
})
export class TextField_Base_Component {
  constructor() {}
}
