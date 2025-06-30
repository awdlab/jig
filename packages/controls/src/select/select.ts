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

type TransformedOption = {
  data: object;
  label: string;
  value: unknown;
  testId?: string;
  group?: string;
};

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
  public readonly fieldGroupItems = input<keyof Option>();

  public readonly filter = input<SelectFilterOptions<Option> | true>();
  public readonly filterText = input<string>();
  public readonly filterIcon = input<IconType>();

  protected readonly filterTextInternal = linkedSignal(this.filterText);

  protected readonly transformedOptions = computed<TransformedOption[]>(() => {
    const options = this.options();

    const fieldLabel = this.fieldLabel();
    const fieldValue = this.fieldValue();
    const fieldTestId = this.fieldTestId();
    const fieldGroupItems = this.fieldGroupItems();

    return options.map(option => {
      const label = option[fieldLabel] as string;
      const value = option[fieldValue];
      const testId = fieldTestId ? option[fieldTestId] : undefined;
      const group = fieldGroupItems ? option[fieldGroupItems] : undefined;

      return {
        data: option,
        label,
        value,
        testId,
      };
    });
  });

  private readonly _flatOptions = computed(() => {
    const groupItems = this.fieldGroupItems();
    if (!groupItems) {
      return this.options();
    }
    return this.options().flatMap(option => {
      const group = option[groupItems];
      if (Array.isArray(group)) {
        return group;
      }
      return [option];
    });
  });

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
    this._flatOptions().find(option => option[this.fieldValue()] === this.value())
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
