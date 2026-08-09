import { booleanAttribute, computed, Directive, input, model, output } from '@angular/core';
import { generateElementId } from '@awdlab/jig/utils-ng';

import { AwdBase } from './base';

import type { FormValueControl } from '@angular/forms/signals';
import type { ControlName } from '@awdlab/jig-themes/templates';

/**
 * When a control surfaces its invalid styling (border / `aria-invalid`):
 * - `touched` — after the user has blurred the control (default).
 * - `dirty` — once the value has changed.
 * - `immediate` — as soon as it is invalid (e.g. explicit `[invalid]`).
 * - `never` — never style invalid.
 */
export type AwdInvalidTrigger = 'touched' | 'dirty' | 'immediate' | 'never';

/**
 * Gates a raw invalid flag by an {@link AwdInvalidTrigger} against the given
 * interaction state. Shared by {@link ValueControlBase} and `AwdInput`.
 */
export function resolveInvalidState(
  invalid: boolean,
  trigger: AwdInvalidTrigger,
  touched: boolean,
  dirty: boolean
): boolean {
  if (!invalid) {
    return false;
  }
  switch (trigger) {
    case 'immediate':
      return true;
    case 'never':
      return false;
    case 'dirty':
      return dirty;
    case 'touched':
    default:
      return touched;
  }
}

@Directive()
export abstract class ValueControlBase<C extends ControlName, T>
  extends AwdBase<C>
  implements FormValueControl<T>
{
  /**
   * The label for the control.
   */
  public readonly label = input<string | null>(null);
  /**
   * Sets the `aria-labelledby` attribute on the control.
   * @default null
   */
  public readonly labelledBy = input<string | null>(null);
  /**
   * The ID for the control
   * @default generateElementId()
   */
  public readonly inputId = input<string>(generateElementId());
  /**
   * The raw invalid flag. A bound signal-forms field writes it in from the
   * field's validity (`FormUiControl` `invalid` input); the app may also set it
   * explicitly. Whether it actually *shows* is gated by {@link invalidOn} — map
   * the theme's invalid part (and any `aria-invalid`) to {@link invalidState},
   * not this.
   * @default false
   */
  public readonly invalid = input(false, { transform: booleanAttribute });

  /**
   * When the control surfaces its invalid styling. The control owns this timing
   * (independent of `ngnErrors`, which governs only the error *message*).
   * @default touched
   */
  public readonly invalidOn = input<AwdInvalidTrigger>('touched');

  /**
   * The invalid state the theme should render: {@link invalid} gated by
   * {@link invalidOn} against {@link touched} / {@link dirty}. Controls map their
   * theme `invalid` part (and any `aria-invalid`) to this.
   */
  protected readonly invalidState = computed(() =>
    resolveInvalidState(this.invalid(), this.invalidOn(), this.touched(), this.dirty())
  );
  /**
   * The value of the control.
   */
  public readonly value = model<T>(undefined as T);
  /**
   * Set the disabled state of the control.
   */
  public readonly disabled = input(false, { transform: booleanAttribute });

  public readonly readonly = input(false, { transform: booleanAttribute });

  /**
   * The touched state. A bound signal-forms field writes it in via the
   * `FormUiControl` `touched` input; the control writes it out through
   * {@link markTouched} on blur.
   */
  public readonly touched = model(false);

  public readonly dirty = input(false, { transform: booleanAttribute });

  /**
   * Emits when focus leaves the control (the `FormUiControl` `touch` contract).
   * The `Field` directive listens to this to mark the bound field touched — it's
   * the only channel signal forms observes for blur, so plain `touched` writes
   * don't reach the field.
   */
  public readonly touch = output<void>();

  /**
   * Marks the control touched: flips {@link touched} for local / no-form
   * consumers (e.g. `ngnErrors`) and emits {@link touch} so a bound signal-forms
   * field is marked touched too. Each control calls this from its own blur/close
   * logic — composite controls with an out-of-DOM overlay (select, calendar)
   * call it from their popover-aware blur, so opening the overlay isn't mistaken
   * for a blur.
   */
  protected markTouched(): void {
    this.touched.set(true);
    this.touch.emit();
  }
}
