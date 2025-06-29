import { Component, forwardRef, inject, InjectionToken, input } from '@angular/core';
import { FormFieldBase } from './form-field-base';

const FORM_FIELD = new InjectionToken<FormField>('FormField');

@Component({
  selector: 'ngn-form-field',
  templateUrl: './form-field.html',
  styles: `
    .ngn-form-field {
      border: 2px solid black;
    }
  `,
  providers: [
    {
      provide: FORM_FIELD,
      useExisting: forwardRef(() => FormField),
    },
  ],
})
export class FormField implements FormFieldBase {
  private readonly _parentFormField = inject(FORM_FIELD, { optional: true, skipSelf: true });
  protected readonly hasParentFormField = !!this._parentFormField;

  public readonly label = input<string | null>(null);
  public readonly inputId = input<string | null>(null);
}
