import { Component, input } from '@angular/core';
import { FormField } from '@ngneers/controls/form-field';
import { generateElementId } from '@ngneers/controls/utils';
import { FormFieldBase } from 'packages/controls/src/form-field/form-field-base';

@Component({
  selector: 'ngn-text-field',
  templateUrl: './text-field.html',
  imports: [FormField],
})
export class TextField implements FormFieldBase {
  public readonly label = input<string | null>(null);
  public readonly inputId = input<string>(generateElementId());
}
