import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, linkedSignal, signal, viewChild } from '@angular/core';
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
import { asyncComputed } from '@ngneers/controls/utils';

import { SelectTemplates } from './select-templates';
import {
  SelectFilterOptions,
  SelectFilterOptionsInternal,
  SelectOption,
  SelectOptionFields,
} from './types';
import { flatOptions, transformToSelectOptions } from './utils';
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
  public readonly filter = input<SelectFilterOptions<SelectOption<T>> | boolean>();
  public readonly filterText = input<string>();
  public readonly filterIcon = input<IconType>();

  protected readonly filterTextInternal = linkedSignal(this.filterText);

  protected readonly currentHighlightedValue = signal<T[K] | null>(null);

  private readonly _options = computed(() => {
    const fields = this.fields();
    const options = this.options();
    if (!fields) {
      return options as SelectOption<T, K>[];
    }
    return transformToSelectOptions(options as T[], fields);
  });

  private readonly _flatOptions = computed(() => flatOptions(this._options()));

  private readonly _appliedFilterOptions = computed(() => {
    const filter = this.filter();
    if (!filter) {
      return null;
    }
    const providedFilterArgs = typeof filter === 'boolean' ? {} : filter;
    const options: SelectFilterOptionsInternal<SelectOption> = {
      filterFieldsCallback: item => item.label,
      fieldItems: 'items',
      splitWords: true,
      caseSensitive: false,
      clearFilterOnClose: true,
      filterFn: 'contains',
      ...providedFilterArgs,
    };
    return options;
  });

  // Replace with resource API when previous value persists
  protected readonly filteredOptions = asyncComputed(async () => {
    const filter = this._appliedFilterOptions();
    const filterText = this.filterTextInternal();
    if (!filter || !filterText) {
      return this._options();
    }
    return await filterOptions<SelectOption>(this._options(), filterText, filter);
  }, []);

  protected readonly filterIsExecuting = this.filteredOptions.isRunning;

  protected readonly selectedItem = computed(() =>
    this._flatOptions().find(option => option.value === this.value())
  );

  protected onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!this._popover().isOpen()) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      const filteredFlatOptions = flatOptions(this.filteredOptions());
      this.currentHighlightedValue.update(currentValue => {
        const currentHighlightIndex = filteredFlatOptions.findIndex(
          option => option.value === currentValue
        );
        if (filteredFlatOptions.length === 0) {
          return null;
        }
        const currentIndex =
          currentHighlightIndex >= 0
            ? currentHighlightIndex
            : filteredFlatOptions.findIndex(option => option.value === this.value());

        if (currentIndex === null) {
          return event.key === 'ArrowDown'
            ? filteredFlatOptions[0].value
            : filteredFlatOptions[filteredFlatOptions.length - 1].value;
        }

        const nextIndex = event.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex < 0) {
          return filteredFlatOptions[filteredFlatOptions.length - 1].value;
        }
        if (nextIndex >= filteredFlatOptions.length) {
          return filteredFlatOptions[0].value;
        }
        return filteredFlatOptions[nextIndex].value;
      });
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.stopImmediatePropagation();
      event.preventDefault();
      const currentHighlightedValue = this.currentHighlightedValue();
      if (currentHighlightedValue !== null) {
        this.onSelect(currentHighlightedValue);
      } else {
        this._popover().toggle();
      }
    }
  }

  protected onPopoverClosed() {
    this.currentHighlightedValue.set(null);
    if (this._appliedFilterOptions()?.clearFilterOnClose) {
      this.filterTextInternal.set('');
    }
  }

  public onSelect(value: T[K]) {
    if (this.value() !== value) {
      this.value.set(value);
      this.onChange(value);
    }
    this.close();
  }

  public close() {
    this._popover().close();
  }
}
