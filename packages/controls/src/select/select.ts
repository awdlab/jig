import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, linkedSignal, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  filterOptions,
  NgnTemplate,
  valueControlBaseProvider,
  mapToItems,
  NgnItem,
  NgnItemFields,
  transformToNgnItems,
  injectThemeTemplate,
} from '@ngneers/controls/api';
import { IconType } from '@ngneers/controls/custom-types';
import { FormField } from '@ngneers/controls/form-field';
import { Icon } from '@ngneers/controls/icon';
import { ListBox } from '@ngneers/controls/list-box';
import { Popover, PopoverOptions } from '@ngneers/controls/popover';
import { TextField } from '@ngneers/controls/text-field';
import { asyncComputed } from '@ngneers/controls/utils';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

import { SelectTemplates } from './select-templates';
import { SelectFilterOptions, SelectFilterOptionsInternal } from './types';

@Component({
  selector: 'ngn-select',
  templateUrl: './select.html',
  imports: [
    NgClass,
    FormField,
    FormsModule,
    ListBox,
    TextField,
    Popover,
    NgTemplateOutlet,
    NgnTemplate,
    Icon,
  ],
  providers: [valueControlBaseProvider(Select)],
})
export class Select<T extends object, K extends keyof T> extends SelectTemplates<T, K> {
  protected readonly theme = injectThemeTemplate(selectControlTemplate);
  private readonly _popover = viewChild.required<Popover>(Popover);

  public readonly popoverOptions = input<PopoverOptions>({});
  protected readonly appliedPopoverOptions = computed(() => ({
    ...this.popoverOptions(),
    sizeConstraints: {
      width: 1,
      maxWidth: 1,
      ...this.popoverOptions().sizeConstraints,
    },
  }));
  public readonly options = input<readonly NgnItem<T, K>[] | readonly T[]>([]);
  public readonly fields = input<NgnItemFields<T, K>>();
  public readonly filter = input<SelectFilterOptions<NgnItem<T, K>> | boolean>();
  public readonly filterText = input<string>();
  public readonly filterIcon = input<IconType>();
  public readonly virtual = input<boolean>(false);
  public readonly itemHeight = input<number>();
  private readonly _listbox = viewChild(ListBox);

  protected readonly filterTextInternal = linkedSignal(this.filterText);

  protected readonly currentHighlightedValue = signal<T[K] | null>(null);

  private readonly _options = computed(() => {
    const fields = this.fields();
    const options = this.options();
    if (!fields) {
      return options as NgnItem<T, K>[];
    }
    return transformToNgnItems(options as T[], fields);
  });

  private readonly _flatOptions = computed(() => mapToItems(this._options()));

  private readonly _appliedFilterOptions = computed(() => {
    const filter = this.filter();
    if (!filter) {
      return null;
    }
    const providedFilterArgs = typeof filter === 'boolean' ? {} : filter;
    const options: SelectFilterOptionsInternal<NgnItem> = {
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
    return await filterOptions<NgnItem>(this._options(), filterText, filter);
  }, []);

  protected readonly filterIsExecuting = this.filteredOptions.isRunning;

  protected readonly selectedItem = computed(() =>
    this._flatOptions().find(option => option.value === this.value())
  );

  protected onKeyDown(event: KeyboardEvent) {
    this._listbox()?.onKeyDown(event);
    // if event is not handled by the listbox, we can handle it here
    if (!event.defaultPrevented) {
      if (event.key === 'Enter' || event.key === ' ') {
        this._popover().toggle();
        event.stopPropagation();
        event.preventDefault();
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
