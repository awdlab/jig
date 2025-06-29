import { Component, input } from '@angular/core';
import { FormField } from '@ngneers/controls/form-field';
import { generateElementId } from '@ngneers/controls/utils';

@Component({
  selector: 'ngn-text-field',
  templateUrl: './text-field.html',
  imports: [FormField],
})
export class TextField {
  public readonly label = input<string | null>(null);
  public readonly inputId = input<string>(generateElementId());
}
