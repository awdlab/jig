import { NgClass } from '@angular/common';
import {
  booleanAttribute,
  Component,
  forwardRef,
  inject,
  input,
  ChangeDetectionStrategy,
  effect,
  contentChild,
} from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnInput } from '@ngneers/controls/input';
import { generateElementId } from '@ngneers/controls/utils-ng';
import { CustomKind, IconType } from '@ngneers/controls-custom-types';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

import { INPUT_FIELD } from './token';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgnIcon, NgnButton],
  selector: 'ngn-input-field',
  templateUrl: './input-field.html',
  host: {
    '[class]': 'theme.class("host")',
  },
  providers: [
    {
      provide: INPUT_FIELD,
      useExisting: forwardRef(() => NgnInputField),
    },
    provideSelf(NgnInputField),
  ],
})
export class NgnInputField extends NgnBase<'inputField'> {
  protected readonly theme = this.injectThemeTemplate(inputFieldControlTemplate);
  protected readonly i18n = inject(I18n).translations;
  private readonly _parentInputfield = inject(INPUT_FIELD, { optional: true, skipSelf: true });
  protected readonly hasParentInputfield = !!this._parentInputfield;

  /**
   * Label for the input field
   * @default null
   */
  public readonly label = input<string | null>(null);
  /**
   * Sets the `aria-labelledby` attribute on the input element
   * @default null
   */
  public readonly labelledBy = input<string | null>(null);
  /**
   * The kind of label presentation
   * @todo add link to custom kind documentation subsection label
   * @default undefined
   */
  public readonly labelKind = input<CustomKind<'inputFieldLabel'>>(undefined as never);
  /**
   * ID for the input element
   */
  public readonly inputId = input<string>(generateElementId());
  /**
   * Show clear button
   * @default false
   */
  public readonly showClearButton = input(false, { transform: booleanAttribute });
  /**
   * Custom icon for the clear button. Use with `showClearButton`.
   */
  public readonly iconClearButton = input<IconType>();
  /**
   * Tabindex for the input field itself.
   * When another focusable (input) element is present inside the input field, this should be set to -1.
   * @default -1
   */
  public readonly tabindex = input<number>(-1);
  /**
   * Explicitly apply invalid state styling
   * @default false
   */
  public readonly invalid = input(false, { transform: booleanAttribute });

  private readonly _ngnInput = contentChild(NgnInput);

  constructor() {
    super();
    this.initializeAutoThemeClasses('labelKind', this.labelKind);
    effect(() => {
      const ngnInput = this._ngnInput();
      if (!ngnInput) {
        return;
      }
      ngnInput.element.nativeElement.id = this.inputId();
    });
    effect(() => {
      const ngnInput = this._ngnInput();
      if (!ngnInput) {
        return;
      }
      const labelledBy = this.labelledBy();
      ngnInput.element.nativeElement.setAttribute('aria-labelledby', labelledBy ?? '');
    });
  }

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

  protected clearButtonClicked(event: MouseEvent) {
    event.stopPropagation();
    const inputElement = this.element.nativeElement.querySelector('input, textarea');
    if (inputElement) {
      (inputElement as HTMLInputElement | HTMLTextAreaElement).value = '';
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
      (inputElement as HTMLInputElement | HTMLTextAreaElement).focus();
    }
  }
}
