import { NgClass } from '@angular/common';
import { Component, forwardRef, inject, InjectionToken, input } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { BaseDirective } from '@ngneers/controls/base';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

import { InputfieldBase } from './input-field-base';

const FORM_FIELD = new InjectionToken<InputField>('Inputfield');

@Component({
  imports: [NgClass],
  selector: 'ngn-input-field',
  templateUrl: './input-field.html',
  providers: [
    {
      provide: FORM_FIELD,
      useExisting: forwardRef(() => InputField),
    },
  ],
})
export class InputField extends BaseDirective implements InputfieldBase {
  protected readonly theme = injectThemeTemplate(inputFieldControlTemplate);
  private readonly _parentInputfield = inject(FORM_FIELD, { optional: true, skipSelf: true });
  protected readonly hasParentInputfield = !!this._parentInputfield;

  public readonly label = input<string | null>(null);
  public readonly inputId = input<string | null>(null);
}
