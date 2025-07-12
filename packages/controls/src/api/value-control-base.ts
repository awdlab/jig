import { Directive, input, signal, Type } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseDirective } from '@ngneers/controls/base';
import { InputfieldBase } from '@ngneers/controls/input-field';
import { generateElementId } from '@ngneers/controls/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function valueControlBaseProvider<T extends Type<ValueControlBase<any>>>(
  type: T
): { provide: typeof NG_VALUE_ACCESSOR; useExisting: T; multi: boolean } {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: type,
    multi: true,
  };
}

@Directive()
export abstract class ValueControlBase<T>
  extends BaseDirective
  implements InputfieldBase, ControlValueAccessor
{
  public readonly label = input<string | null>(null);
  public readonly inputId = input<string>(generateElementId());

  private readonly _value = signal<T | null>(null);
  public readonly value = this._value.asReadonly();

  public writeValue(value: T | null): void {
    this._value.set(value ?? null);
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
    this._onTouched();
  }

  protected onChange(value: T) {
    this._onChange(value ?? null);
    this._value.set(value ?? null);
  }
}
