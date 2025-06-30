import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, linkedSignal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FilterConfig,
  filterOptions,
  GetElementRef,
  NgnTemplate,
  valueControlBaseProvider,
} from '@ngneers/controls/api';
import { IconType } from '@ngneers/controls/custom-types';
import { FormField } from '@ngneers/controls/form-field';
import { Popover, PopoverOptions } from '@ngneers/controls/popover';
import { TextField } from '@ngneers/controls/text-field';

import { SelectTemplates } from './select-templates';
import { Icon } from '../icon/icon';

type SelectFilterOptions<Option extends object> = {
  clearFilterOnClose?: boolean;
} & FilterConfig<Option>;

@Component({
  selector: 'ngn-select',
  templateUrl: './select.html',
  imports: [
    FormField,
    FormsModule,
    TextField,
    Popover,
    GetElementRef,
    NgTemplateOutlet,
    NgnTemplate,
    Icon,
  ],
  providers: [valueControlBaseProvider(Select)],
})
export class Select<Option extends object, K extends keyof Option> extends SelectTemplates<
  Option,
  Option[K]
> {
  private readonly _popover = viewChild.required<Popover>(Popover);

  public readonly popoverOptions = input<PopoverOptions>();
  public readonly options = input<readonly Option[]>([]);
  public readonly fieldLabel = input.required<keyof Option>();
  public readonly fieldValue = input.required<K>();
  public readonly fieldTestId = input<keyof Option>();

  public readonly filter = input<SelectFilterOptions<Option> | true>();
  public readonly filterText = input<string>();
  public readonly filterIcon = input<IconType>('fa-solid fa-magnifying-glass');

  protected readonly filterTextInternal = linkedSignal(this.filterText);

  private readonly _appliedFilterOptions = computed<SelectFilterOptions<Option> | null>(() => {
    const filter = this.filter();
    if (!filter) {
      return null;
    }
    const providedFilterArgs = typeof filter === 'boolean' ? {} : filter;
    return {
      filterFields: this.fieldLabel(),
      splitWords: true,
      caseSensitive: false,
      clearFilterOnClose: true,
      filterFn: 'contains',
      ...providedFilterArgs,
    };
  });

  protected readonly filteredOptions = computed(() => {
    const filter = this._appliedFilterOptions();
    const filterText = this.filterTextInternal();
    if (!filter || !filterText) {
      return this.options();
    }
    return filterOptions(this.options(), filterText, filter);
  });

  protected readonly selectedItem = computed(() =>
    this.options().find(option => option[this.fieldValue()] === this.value())
  );

  public onSelect(value: Option[K]) {
    this.value.set(value);
    this.onChange(value);
    this.close();
    if (this._appliedFilterOptions()?.clearFilterOnClose) {
      this.filterTextInternal.set('');
    }
  }

  public close() {
    this._popover().close();
  }
}
