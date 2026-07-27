import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  input,
} from '@angular/core';
import { NgnBase, NGN_CONTROL, provideSelf, NgnPt } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { generateElementId } from '@ngneers/controls/utils-ng';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

import type { CustomKind, IconType } from '@ngneers/controls-custom-types';

/**
 * @category control
 */
@Component({
  imports: [NgnPt, NgnIcon, NgnButton],
  selector: 'ngn-input-field',
  templateUrl: './input-field.html',
  host: {
    '[inert]': 'disabled()',
  },
  providers: [provideSelf(NgnInputField)],
})
export class NgnInputField extends NgnBase<'inputField'> {
  protected readonly theme = this.injectThemeTemplate(inputFieldControlTemplate, {
    host: true,
    filled: () => this.filled(),
  });
  protected readonly i18n = inject(I18n).translations;

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
   * ID for the input element. Defaults to a generated id.
   */
  public readonly inputId = input<string>(generateElementId());
  /**
   * Show clear button
   * @default false
   */
  public readonly showClearButton = input(false, { transform: booleanAttribute });
  /**
   * Custom icon for the clear button. Use with {@link showClearButton}.
   * @default undefined
   */
  public readonly iconClearButton = input<IconType>();
  /**
   * Tabindex for the input field itself.
   * When another focusable (input) element is present inside the input field, this should be set to -1.
   * @default -1
   */
  public readonly tabindex = input<number>(-1);
  /**
   * Explicitly apply invalid state styling on the field chrome. The field does
   * not compute validity — it also reflects its projected control's own invalid
   * state (the child's gated `aria-invalid`) via the theme. Set this only to
   * force the invalid look regardless of the child.
   * @default false
   */
  public readonly invalid = input(false, { transform: booleanAttribute });
  /**
   * Explicitly apply readonly state styling
   * @default false
   */
  public readonly readonly = input(false, { transform: booleanAttribute });
  /**
   * Explicitly apply disabled state styling
   * @default false
   */
  public readonly disabled = input(false, { transform: booleanAttribute });

  private readonly _projectedControls = contentChildren(NGN_CONTROL, { descendants: true });
  /**
   * The projected primary control (input, mask, calendar, …), used to delegate
   * pointer focus, clearing and stepping. Auxiliary controls inside the field
   * (buttons, icons, spin buttons, …) are skipped via `isFieldControl`, so
   * their placement/order never shadows the actual input.
   */
  public readonly control = computed(() => this._projectedControls().find(c => c.isFieldControl));

  /**
   * Whether the projected control holds content. Drives float-label detection
   * component-side (from the control's `empty` signal) so it works for every
   * field control — select, calendar, mask-input — not just native inputs.
   */
  protected readonly filled = computed(() => {
    const control = this.control();
    return !!control && !control.empty();
  });

  /** The primary control's element when it is a native input/textarea. */
  private readonly _inputElement = computed(() => {
    const el = this.control()?.element.nativeElement;
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')
      ? (el as HTMLInputElement | HTMLTextAreaElement)
      : undefined;
  });

  constructor() {
    super();
    this.initializeAutoThemeClasses('labelKind', this.labelKind);
    effect(() => {
      const inputElement = this._inputElement();
      if (!inputElement) {
        return;
      }
      inputElement.id = this.inputId();
    });
    effect(() => {
      const inputElement = this._inputElement();
      if (!inputElement) {
        return;
      }
      const labelledBy = this.labelledBy();
      inputElement.setAttribute('aria-labelledby', labelledBy ?? '');
    });
  }

  protected clicked(event: MouseEvent) {
    // Give the projected control a chance to place focus from the pointer
    // location (e.g. mask-input selects the section nearest the click). If it
    // handles the event, skip the primitive focusing below.
    if (this.control()?.focusFromPointer(event)) return;

    if (!(event.target instanceof Node)) return;

    const root = this.element.nativeElement;
    const targetElement = event.target instanceof Element ? event.target : null;

    // Controls that open/toggle on click (select combobox, calendar field) expose
    // their interactive host as the focusable element (tabindex="0") -> redirect click there.
    const focusable = root.querySelector<HTMLElement>('[tabindex="0"]');
    if (focusable && !focusable.contains(event.target)) {
      focusable.click();
      return;
    }

    // Keep real projected actions (buttons, links, explicit tab stops) in charge of their own click.
    const interactiveTarget = targetElement?.closest(
      'button, a[href], select, [role="button"], [tabindex]:not([tabindex="-1"])'
    );
    if (interactiveTarget && root.contains(interactiveTarget)) {
      return;
    }

    // Plain input fields: clicking the field chrome or non-interactive adornments should focus
    // the actual input, even when the pointer target is SVG content inside an icon/state control.
    this._inputElement()?.focus();
  }

  protected clearButtonClicked(event: MouseEvent) {
    event.stopPropagation();
    // Controls that manage their own value (e.g. mask-input) clear via the hook;
    // the DOM fallback below only works for plain text inputs.
    if (this.control()?.clearValue()) {
      return;
    }
    const inputElement = this.element.nativeElement.querySelector('input, textarea');
    if (inputElement) {
      (inputElement as HTMLInputElement | HTMLTextAreaElement).value = '';
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
      (inputElement as HTMLInputElement | HTMLTextAreaElement).focus();
    }
  }
}
