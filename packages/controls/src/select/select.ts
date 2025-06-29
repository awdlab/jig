import { Component, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GetElementRef, ValueControlBase } from '@ngneers/controls/api';
import { FormField } from '@ngneers/controls/form-field';
import { Popover, PopoverOptions } from '@ngneers/controls/popover';

@Component({
  selector: 'ngn-select',
  templateUrl: './select.html',
  imports: [FormField, Popover, GetElementRef],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: Select,
      multi: true,
    },
  ],
})
export class Select<T> extends ValueControlBase<T> {
  public readonly popoverOptions = input<PopoverOptions>();

  public readonly options: T[] = [];

  public onSelect(value: T) {
    this.onChange(value);
  }
}
