import { Component, input, signal, Type } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormFieldBase } from '@ngneers/controls/form-field';
import { generateElementId } from '@ngneers/controls/utils';

export function valueControlBaseProvider<T extends Type<ValueControlBase<any>>>(
  type: T
): { provide: typeof NG_VALUE_ACCESSOR; useExisting: T; multi: boolean } {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: type,
    multi: true,
  };
}

@Component({
  template: '',
  imports: [],
})
export abstract class ValueControlBase<T> implements FormFieldBase, ControlValueAccessor {
  public readonly label = input<string | null>(null);
  public readonly inputId = input<string>(generateElementId());

  protected readonly value = signal<T | null>(null);

  public writeValue(value: T | null): void {
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
    this._onTouched();
  }

  protected onChange(value: T) {
    this._onChange(value);
  }
}
