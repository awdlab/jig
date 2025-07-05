import { Component, forwardRef, inject, InjectionToken, input } from '@angular/core';
import { BaseDirective } from '@ngneers/controls/base';

import { InputfieldBase } from './input-field-base';

const FORM_FIELD = new InjectionToken<Inputfield>('Inputfield');

@Component({
  selector: 'ngn-input-field',
  templateUrl: './input-field.html',
  styles: `
    .ngn-input-field {
      border: 2px solid black;
    }
  `,
  providers: [
    {
      provide: FORM_FIELD,
      useExisting: forwardRef(() => Inputfield),
    },
  ],
})
export class Inputfield extends BaseDirective implements InputfieldBase {
  private readonly _parentInputfield = inject(FORM_FIELD, { optional: true, skipSelf: true });
  protected readonly hasParentInputfield = !!this._parentInputfield;

  public readonly label = input<string | null>(null);
  public readonly inputId = input<string | null>(null);
}
