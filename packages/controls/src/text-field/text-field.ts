import { Component, input, signal } from '@angular/core';
import { FormField, FormFieldBase } from '@ngneers/controls/form-field';
import { generateElementId } from '@ngneers/controls/utils';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ngn-text-field',
  templateUrl: './text-field.html',
  imports: [FormField],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextField,
      multi: true,
    },
  ],
})
export class TextField implements FormFieldBase, ControlValueAccessor {
  public readonly label = input<string | null>(null);
  public readonly inputId = input<string>(generateElementId());

  protected readonly value = signal<string>('');

  public writeValue(value: string): void {
    this.value.set(value);
  }
  private _onChange: (_: string) => void = () => {};
  public registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }
  private _onTouched: () => void = () => {};
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public onTouched() {
    this._onTouched();
  }

  public onChange(value: Event) {
    this._onChange((value.target as HTMLInputElement).value);
  }
}
