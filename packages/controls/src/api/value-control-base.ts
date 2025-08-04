import { Directive, input, model, Type } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgnBase } from '@ngneers/controls/base';
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
export abstract class ValueControlBase<T> extends NgnBase implements ControlValueAccessor {
  public readonly label = input<string | null>(null);
  public readonly inputId = input<string>(generateElementId());

  public readonly value = model<T | null>(null);

  public writeValue(value: T | null): void {
    this.value.set(value ?? null);
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
    this.value.set(value ?? null);
  }
}
