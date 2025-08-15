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
  NgnTemplate,
  valueControlBaseProvider,
  mapToItems,
  NgnItem,
  NgnItemFields,
  transformToNgnItems,
  injectThemeTemplate,
} from '@ngneers/controls/api';
import { IconType } from '@ngneers/controls/custom-types';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnListBox } from '@ngneers/controls/list-box';
import { NgnPopover, PopoverOptions } from '@ngneers/controls/popover';
import { asyncComputed, setInputSignalValue } from '@ngneers/controls/utils';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

import { SelectTemplates, ValueType } from './select-templates';
import { SelectFilterOptions, SelectFilterOptionsInternal } from './types';

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
> extends SelectTemplates<T, K, Editable> {
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
   * @defaultValue `false`
   */
  public readonly editable = input<Editable>();
  private readonly _listbox = viewChild(NgnListBox);

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

  constructor() {
    super();
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
        setInputSignalValue(valueSig, this.value() || '');
      }
    });
  }

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
      if (this.editable()) {
        const item = this._flatOptions().find(option => option.value === value);
        if (item) {
          this.onChange(item.label as ValueType<T, K, Editable>);
        }
      } else {
        this.onChange(value);
      }
    }
    this.close();
  }

  public close() {
    this._popover().close();
  }

  protected onEditableChange(value: string | null) {
    if (this.editable()) {
      this.onChange(value as ValueType<T, K, Editable>);
    }
  }
}
