import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, viewChild } from '@angular/core';
import { GetElementRef, NgnTemplate, valueControlBaseProvider } from '@ngneers/controls/api';
import { IconType } from '@ngneers/controls/custom-types';
import { FormField } from '@ngneers/controls/form-field';
import { Popover, PopoverOptions } from '@ngneers/controls/popover';

import { SelectTemplates } from './select-templates';

@Component({
  selector: 'ngn-select',
  templateUrl: './select.html',
  imports: [FormField, Popover, GetElementRef, NgTemplateOutlet, NgnTemplate],
  providers: [valueControlBaseProvider(Select)],
})
export class Select<Option, K extends keyof Option> extends SelectTemplates<Option, Option[K]> {
  private readonly _popover = viewChild.required<Popover>(Popover);

  public readonly popoverOptions = input<PopoverOptions>();
  public readonly options = input<readonly Option[]>([]);
  public readonly fieldLabel = input.required<keyof Option>();
  public readonly fieldId = input.required<K>();

  public readonly icon = input<IconType>();

  protected readonly selectedItem = computed(() =>
    this.options().find(option => option[this.fieldId()] === this.value())
  );

  public onSelect(value: Option[K]) {
    this.value.set(value);
    this.onChange(value);
    this.close();
  }

  public close() {
    this._popover().close();
  }
}
