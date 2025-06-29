import { Component, input } from '@angular/core';

@Component({
  selector: 'ngn-form-field',
  templateUrl: './form-field.html',
})
export class FormField {
  public readonly label = input<string | null>(null);
  public readonly inputId = input<string | null>(null);
}
