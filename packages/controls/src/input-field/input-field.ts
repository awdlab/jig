import { NgClass } from '@angular/common';
import { Component, forwardRef, inject, input } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api/ng';
import { NgnBase } from '@ngneers/controls/base';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

import { INPUT_FIELD } from './token';

/**
 * @category control
 */
@Component({
  imports: [NgClass],
  selector: 'ngn-input-field',
  templateUrl: './input-field.html',
  providers: [
    {
      provide: INPUT_FIELD,
      useExisting: forwardRef(() => NgnInputField),
    },
  ],
})
export class NgnInputField extends NgnBase {
  protected readonly theme = injectThemeTemplate(inputFieldControlTemplate);
  private readonly _parentInputfield = inject(INPUT_FIELD, { optional: true, skipSelf: true });
  protected readonly hasParentInputfield = !!this._parentInputfield;

  public readonly label = input<string | null>(null);
  public readonly inputId = input<string | null>(null);
  public readonly tabindex = input<number>();
  /**
   * Explicitly apply invalid state styling
   * @default false
   */
  public readonly invalid = input<boolean>(false);

  protected clicked(event: MouseEvent) {
    // Prevent click event from propagating to parent input field
    if (this.hasParentInputfield) {
      return;
    }
    if (event.target instanceof HTMLElement) {
      // Focus the input element when the input field is clicked
      const inputElement = event.target.querySelector('input, textarea');
      if (inputElement) {
        (inputElement as HTMLInputElement | HTMLTextAreaElement).focus();
      }
    }
  }
}
