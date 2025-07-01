import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, linkedSignal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
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
import { SelectFilterOptions, SelectOption, SelectOptionFields } from './types';
import { transformToSelectOptions } from './utils';
import { Icon } from '../icon/icon';

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
export class Select<T extends object, K extends keyof T> extends SelectTemplates<T, K> {
  private readonly _popover = viewChild.required<Popover>(Popover);

  public readonly popoverOptions = input<PopoverOptions>({
    sizeConstraints: {
      width: 1,
      maxWidth: 1,
    },
  });
  public readonly options = input<readonly SelectOption<T, K>[] | readonly T[]>([]);
  public readonly fields = input<SelectOptionFields<T, K>>();
  public readonly filter = input<SelectFilterOptions<T> | true>();
  public readonly filterText = input<string>();
  public readonly filterIcon = input<IconType>();

  protected readonly filterTextInternal = linkedSignal(this.filterText);

  private readonly _options = computed(() => {
    const fields = this.fields();
    const options = this.options();
    if (!fields) {
      return options as SelectOption<T, K>[];
    }
    return transformToSelectOptions(options as T[], fields);
  });

  private readonly _flatOptions = computed(() => {
    return this._options()
      .map(option => {
        if (option.items) {
          return option.items;
        }
        return [option];
      })
      .flat();
  });

  private readonly _appliedFilterOptions = computed<SelectFilterOptions<SelectOption> | null>(
    () => {
      const filter = this.filter();
      if (!filter) {
        return null;
      }
      const providedFilterArgs = typeof filter === 'boolean' ? {} : filter;
      const options: SelectFilterOptions<SelectOption> = {
        filterFieldsCallback: item => item.label,
        fieldItems: 'items',
        splitWords: true,
        caseSensitive: false,
        clearFilterOnClose: true,
        filterFn: 'contains',
        ...providedFilterArgs,
      };
      return options;
    }
  );

  protected readonly filteredOptions = computed(() => {
    const filter = this._appliedFilterOptions();
    const filterText = this.filterTextInternal();
    if (!filter || !filterText) {
      return this._options();
    }
    return filterOptions<SelectOption>(this._options(), filterText, filter);
  });

  protected readonly selectedItem = computed(() =>
    this._flatOptions().find(option => option.value === this.value())
  );

  public onSelect(value: T[K]) {
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
