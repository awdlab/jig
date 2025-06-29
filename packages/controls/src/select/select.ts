import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GetElementRef, NgnTemplate } from '@ngneers/controls/api';
import { FormField } from '@ngneers/controls/form-field';
import { Popover, PopoverOptions } from '@ngneers/controls/popover';

import { SelectTemplates } from './select-templates';

@Component({
  selector: 'ngn-select',
  templateUrl: './select.html',
  imports: [FormField, Popover, GetElementRef, NgTemplateOutlet, NgnTemplate],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: Select,
      multi: true,
    },
  ],
})
export class Select<Option, K extends keyof Option> extends SelectTemplates<Option, Option[K]> {
  public readonly popoverOptions = input<PopoverOptions>();

  public readonly options = input<Option[]>([]);

  public readonly fieldLabel = input.required<keyof Option>();
  public readonly fieldId = input.required<K>();

  protected readonly selectedItem = computed(() =>
    this.options().find(option => option[this.fieldId()] === this.value())
  );

  public onSelect(value: Option[K]) {
    this.value.set(value);
    this.onChange(value);
  }
}
