import { booleanAttribute, computed, Directive, input, model, signal, Type } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { generateElementId } from '@ngneers/controls/utils-ng';
import { ControlName } from '@ngneers/controls-themes/templates';

import { NgnBase } from './base';

export function valueControlBaseProvider<T extends Type<any>>(
  type: T
): { provide: typeof NG_VALUE_ACCESSOR; useExisting: T; multi: boolean } {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: type,
    multi: true,
  };
}

@Directive()
export abstract class ValueControlBase<C extends ControlName, T>
  extends NgnBase<C>
  implements ControlValueAccessor
{
  /**
   * The label for the control.
   */
  public readonly label = input<string | null>(null);
  /**
   * The ID for the control
   * @default generateElementId()
   */
  public readonly inputId = input<string>(generateElementId());
  /**
   * Explicitly apply invalid state styling
   * @default false
   */
  public readonly invalid = input<boolean>(false);
  /**
   * The value of the control.
   */
  public readonly value = model<T>(undefined as T);
  /**
   * Set the disabled state of the control.
   */
  public readonly disabled = input(false, {
    transform: booleanAttribute,
  });
  private readonly _isDisabled = signal<boolean>(false);
  /**
   * Read the disabled state of the control.
   */
  public readonly isDisabled = computed(() => this._isDisabled() || this.disabled());

  public readonly isInvalid = computed(() => this.invalid());

  public writeValue(value: T): void {
    this.value.set(value);
  }
  private _onChange: (_: T | null) => void = () => {};
  public registerOnChange(fn: (value: T | null) => void): void {
    this._onChange = fn;
  }
  private _onTouched: () => void = () => {};
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  protected onTouched() {
    if (this.isDisabled()) {
      return;
    }
    this._onTouched();
  }

  protected onChange(value: T) {
    if (this.isDisabled()) {
      return;
    }
    this._onChange(value);
    this.value.set(value);
  }

  public setDisabledState(isDisabled: boolean): void {
    this._isDisabled.set(isDisabled);
  }
}
