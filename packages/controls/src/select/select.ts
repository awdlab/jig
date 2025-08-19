import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  effect,
  input,
  linkedSignal,
  OutputRefSubscription,
  signal,
  viewChild,
} from '@angular/core';
import {
  filterOptions,
  mapToItems,
  NgnItem,
  NgnItemFields,
  transformToNgnItems,
} from '@ngneers/controls/api';
import {
  NgnTemplate,
  valueControlBaseProvider,
  injectThemeTemplate,
} from '@ngneers/controls/api/ng';
import { IconType } from '@ngneers/controls/custom-types';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnListBox } from '@ngneers/controls/list-box';
import { NgnPopover, PopoverOptions } from '@ngneers/controls/popover';
import { NgnError } from '@ngneers/controls/utils';
import { asyncComputed } from '@ngneers/controls/utils-ng';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

import { SelectTemplates, ValueType } from './select-templates';
import { SelectFilterOptions, SelectFilterOptionsInternal } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-select',
  templateUrl: './select.html',
  imports: [
    NgClass,
    NgnInputField,
    NgnListBox,
    NgnPopover,
    NgnInput,
    NgTemplateOutlet,
    NgnTemplate,
    NgnIcon,
  ],
  providers: [valueControlBaseProvider(NgnSelect)],
  host: {
    '[class]': 'theme.class("")',
    style: 'display: block;',
  },
})
export class NgnSelect<
  T extends object = object,
  K extends keyof T = never,
  Editable extends boolean = false,
  Multiple extends boolean = false,
> extends SelectTemplates<T, K, Editable, Multiple> {
  protected readonly theme = injectThemeTemplate(selectControlTemplate);
  private readonly _popover = viewChild.required<NgnPopover>(NgnPopover);
  private readonly _customEditableInput = contentChild(NgnInput);
  private _customEditableSub?: OutputRefSubscription;

  /**
   * Options for the popover.
   */
  public readonly popoverOptions = input<PopoverOptions>({});
  protected readonly appliedPopoverOptions = computed(() => ({
    ...this.popoverOptions(),
    sizeConstraints: {
      width: 1,
      maxWidth: 1,
      ...this.popoverOptions().sizeConstraints,
    },
  }));
  /**
   * The available options to choose from. They can either be
   * * A list of {@link NgnItem} objects
   * * A list of plain objects. You'll have to provide a {@link fields} input to specify how to map the plain objects to {@link NgnItem} objects.
   */
  public readonly options = input<readonly NgnItem<T, K>[] | readonly T[]>([]);
  /**
   * Required if the options are not `NgnItem` objects.
   */
  public readonly fields = input<NgnItemFields<T, K>>();
  /**
   * Accepts a boolean value that determines whether the filter is enabled.
   * Alternatively, you can provide `SelectFilterOptions` to customize the filter behavior.
   * @defaultValue `false`
   */
  public readonly filter = input<SelectFilterOptions<NgnItem<T, K>> | boolean>(false);
  /**
   * Manually set the filter text.
   */
  public readonly filterText = input<string | null>(null);
  /**
   * The icon to display in the filter input.
   */
  public readonly filterIcon = input<IconType>();
  /**
   * The icon to display in the dropdown.
   */
  public readonly dropdownIcon = input<IconType>();
  /**
   * Whether the select is virtualized.
   * @defaultValue `false`
   */
  public readonly virtual = input<boolean>(false);
  /**
   * When {@link virtual} is enabled, this property defines the height of each item in the list.
   */
  public readonly itemHeight = input<number>();
  /**
   * Enable this to allow the user to type in a value that is not in the list.
   * When enabled, the value of the control becomes the label of a selected item or the typed value.
   *
   * Cannot be used with
   * * {@link multiple} selection
   * * {@link filter} without also setting {@link editableAutoFilter} to `false`
   *
   * @defaultValue `false`
   */
  public readonly editable = input<Editable>();
  /**
   * Whether to automatically filter the options based on the user's input in the {@link editable} input.
   * @defaultValue `true`
   */
  public readonly editableAutoFilter = input<boolean>(true);
  /**
   * Enable this to allow the user to select multiple values.
   * When enabled, the value of the control becomes an array of selected items.
   *
   * This is only applicable when {@link editable} is `false`.
   * @defaultValue `false`
   */
  public readonly multiple = input<Multiple>();
  /**
   * Whether to scroll to the selected item when the dropdown is opened.
   * @defaultValue `true`
   */
  public readonly scrollToSelectedItemOnOpen = input<boolean | ScrollLogicalPosition>(true);

  private readonly _listbox = viewChild(NgnListBox);
  private _userChangedEditableInput = false;

  protected readonly filterTextInternal = linkedSignal(this.filterText);
  protected readonly currentHighlightedValue = signal<T[K] | null>(null);
  protected readonly valueStr = computed(() => {
    const v = this.value();
    return typeof v === 'string' ? v : null;
  });
  protected readonly valueArray = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? v : v ? [v] : [];
  });

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
    const filter = !!this.filter();
    const editable = !!this.editable();
    const appliedFilterOptions = this._appliedFilterOptions();
    const filterText = this.filterTextInternal();
    if ((!filter && !editable) || !filterText) {
      return this._options();
    }
    return await filterOptions<NgnItem>(this._options(), filterText, appliedFilterOptions);
  }, []);

  protected readonly filterIsExecuting = this.filteredOptions.isRunning;

  protected readonly selectedItems = computed(() => {
    if (this.editable()) {
      return [this._flatOptions().find(option => option.label === this.value())];
    } else {
      return this.valueArray().map(value =>
        this._flatOptions().find(option => option.value === value)
      );
    }
  });
  protected readonly selectedItemsValues = computed(() =>
    this.selectedItems().map(item => item?.value)
  );

  constructor() {
    super();
    effect(() => {
      if (this.editable() && this.multiple()) {
        throw new NgnError('select', 'Editable and multiple selection cannot be used together');
      }
      if (this.editable() && this.filter()) {
        throw new NgnError('select', 'Editable and filtering cannot be used together');
      }
    });
    effect(() => {
      this._customEditableSub?.unsubscribe();
      const editable = this.editable();
      const customEditableInput = this._customEditableInput();
      if (!editable || !customEditableInput) {
        return;
      }

      this._customEditableSub = customEditableInput.value.subscribe(value => {
        this.onEditableChange(value);
      });
    });
    effect(() => {
      if (!this.editable()) {
        return;
      }
      const valueSig = this._customEditableInput()?.value;
      if (valueSig) {
        valueSig.set((this.value() as string) || '');
      }
    });
    effect(() => {
      if (!this.editable()) {
        return;
      }
      const hasOptions = !!this.filteredOptions().length;
      if (!this._userChangedEditableInput) {
        return;
      }
      this._userChangedEditableInput = false;
      if (hasOptions) {
        this.open();
      } else {
        this.close();
      }
    });
  }

  protected onKeyDown(event: KeyboardEvent) {
    this._listbox()?.onKeyDown(event);
    // if event is not handled by the listbox, we can handle it here
    if (!event.defaultPrevented) {
      if (event.key === 'Enter') {
        this._popover().toggle();
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }

  protected onPopoverClosed() {
    this.currentHighlightedValue.set(null);
    if (this._appliedFilterOptions()?.clearFilterOnClose) {
      if (!this.editable()) {
        this.filterTextInternal.set('');
      }
    }
  }

  public onSelect(value: ValueType<T, K, Editable, Multiple> | null) {
    if (this.editable()) {
      if (this.value() !== value) {
        const item = this._flatOptions().find(option => option.value === value);
        if (item) {
          this.onChange(item.label as ValueType<T, K, Editable, Multiple>);
        }
      }
    } else if (this.value() !== value) {
      this.onChange(value);
    }
    if (!this.multiple()) {
      this.close();
    }
  }

  public open() {
    this._popover().open();
  }

  public close() {
    this._popover().close();
  }

  protected onEditableChange(value: string | null) {
    if (this.editable()) {
      this.onChange(value as ValueType<T, K, Editable, Multiple>);
      this._userChangedEditableInput = true;
      if (this.editableAutoFilter()) {
        this.filterTextInternal.set(value);
      }
    }
  }
}
