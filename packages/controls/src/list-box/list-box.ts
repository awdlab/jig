import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  computed,
  effect,
  input,
  signal,
  untracked,
  viewChild,
  inject,
  output,
} from '@angular/core';
import {
  type FilterConfig,
  type FilterConfigInternal,
  filterOptions,
  flatItems,
  mapToItems,
  type NgnItem,
  type NgnItemsValue,
} from '@ngneers/controls/api';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnCheckbox } from '@ngneers/controls/checkbox';
import { I18n } from '@ngneers/controls/i18n';
import { NgnScroller, NgnScrollerItem } from '@ngneers/controls/scroller';
import { createConditionalSpinner } from '@ngneers/controls/spinner';
import { maybeCallback } from '@ngneers/controls/utils';
import { asyncComputed } from '@ngneers/controls/utils-ng';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';

import { ListBoxTemplates, type ValueType } from './list-box-templates';

/**
 * @category control
 */
@Component({
  selector: 'ngn-list-box',
  templateUrl: './list-box.html',
  imports: [NgTemplateOutlet, NgnScroller, NgnScrollerItem, NgnCheckbox, NgnTemplate, NgnPt],
  providers: [provideSelf(NgnListBox)],
  host: {
    '[attr.tabIndex]': 'focussable() ? 0 : null',
    '(keydown)': 'onKeyDown($event)',
    '(focusout)': 'currentHighlightedValue.set(null)',
    role: 'listbox',
    '[attr.aria-activedescendant]':
      'currentHighlightedValue() ? inputId() + "_option_" + currentHighlightedValue() : null',
    '[aria-multiselectable]': '!!multiple()',
    '[attr.aria-label]': 'label()',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[id]': 'inputId()',
  },
})
export class NgnListBox<
  Items extends readonly NgnItem[],
  Multiple extends boolean = false,
> extends ListBoxTemplates<Items, Multiple> {
  protected readonly i18n = inject(I18n).translations;
  protected readonly theme = this.injectThemeTemplate(listBoxControlTemplate, {
    root: true,
    invalid: () => this.invalid(),
    empty: () => !this.displayedItems().length,
  });

  private readonly _scroller = viewChild.required<NgnScroller<NgnItemsValue<Items>>>(NgnScroller);

  /**
   * The items to display in the list box.
   */
  public readonly items = input.required<Items>();

  /**
   * Whether to scroll to the selected item when the list box is first rendered.
   * Pass a `ScrollLogicalPosition` to control where the item lands in the viewport.
   * @default false
   */
  public readonly scrollToSelectedItemOnInit = input<boolean | ScrollLogicalPosition>(false);
  /**
   * Whether items can be selected by the user.
   * @default false
   */
  public readonly selectable = input(false, { transform: booleanAttribute });
  /**
   * Whether hovering an item selects it.
   * @default false
   */
  public readonly selectOnHover = input(false, { transform: booleanAttribute });
  /**
   * Whether the list box itself is focusable and participates in keyboard navigation.
   * @default true
   */
  public readonly focussable = input(true, { transform: booleanAttribute });
  /**
   * Whether the list is virtualized.
   * @default false
   */
  public readonly virtual = input(false, { transform: booleanAttribute });
  /**
   * When {@link virtual} is enabled, this defines the height of each item in the list.
   */
  public readonly itemHeight = input<number>();
  /**
   * Enable this to allow the user to select multiple values.
   * When enabled, the value of the control becomes an array of selected items.
   */
  public readonly multiple = input<Multiple>();
  /**
   * Whether to use a checkbox to indicate selection state.
   *
   * This option is true per default when {@link multiple} is `true`.
   * @default multiple()
   */
  public readonly checkbox = input<boolean>();
  /**
   * Accepts a boolean value that determines whether the filter is enabled.
   * Alternatively, you can provide `FilterConfig` to customize the filter behavior.
   * @default `false`
   */
  public readonly filter = input<FilterConfig<Items[number]> | boolean>(false);
  /**
   * Manually set the filter text.
   */
  public readonly filterText = input<string | null>(null);

  /**
   * Emitted when an item is clicked, carrying the value of that item.
   */
  public readonly itemClicked = output<NgnItemsValue<Items>>();

  protected readonly maybeCallback = maybeCallback;

  public readonly displayedItems = computed(() => flatItems(this.filteredItems()));

  protected readonly valueArray = computed(() => {
    const v = this.value();
    return (Array.isArray(v) ? v : v ? [v] : []) as NgnItemsValue<Items>[];
  });
  public readonly currentHighlightedValue = signal<NgnItemsValue<Items> | null>(null);
  protected readonly filteredItems = asyncComputed(async () => {
    const filter = !!this.filter();
    const appliedFilterOptions = this._appliedFilterOptions();
    const filterText = this.filterText();

    if (!filter || !filterText) {
      return this.items();
    }
    return await filterOptions(this.items(), filterText, appliedFilterOptions);
  }, []);

  private readonly _appliedFilterOptions = computed(() => {
    const filter = this.filter();
    const providedFilterArgs = typeof filter === 'boolean' ? {} : filter;
    const options: FilterConfigInternal<NgnItem> = {
      filterFieldsCallback: item => item.label,
      fieldItems: 'items',
      splitWords: true,
      caseSensitive: false,
      filterFn: 'contains',
      ...providedFilterArgs,
    };
    return options;
  });

  protected readonly filterIsExecuting = this.filteredItems.isRunning;

  protected readonly showCheckboxes = computed(() => this.checkbox() ?? this.multiple() ?? false);

  constructor() {
    super();
    createConditionalSpinner(this.filterIsExecuting);

    effect(() => {
      const currentHighlightedValue = this.currentHighlightedValue();
      if (!currentHighlightedValue) {
        return;
      }
      const index = flatItems(this.filteredItems()).findIndex(
        option => option.value === currentHighlightedValue
      );
      this._scroller().scrollToIndex(index);
    });

    afterRenderEffect(() => {
      const pos = this.scrollToSelectedItemOnInit();
      const filterDone = this.filteredItems.firstRunCompleted();
      if (pos && filterDone) {
        const val = untracked(this.value);
        const index = flatItems(untracked(this.filteredItems)).findIndex(
          option => option.value === val
        );
        this._scroller().scrollToIndex(index, pos === true ? 'nearest' : pos);
      }
    });
  }

  public onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.stopPropagation();
      event.preventDefault();
      const flattenedItems = mapToItems(this.filteredItems());
      this.currentHighlightedValue.update(currentValue => {
        const enabledItems = flattenedItems.filter(item => !item.disabled);
        if (enabledItems.length === 0) {
          return null;
        }
        const currentHighlightIndex = enabledItems.findIndex(
          option => option.value === currentValue
        );
        const currentIndex =
          currentHighlightIndex >= 0
            ? currentHighlightIndex
            : enabledItems.findIndex(
                option => option.value === this.valueArray()[this.valueArray().length - 1]
              );

        if (currentIndex === -1) {
          return event.key === 'ArrowDown'
            ? enabledItems[0]?.value
            : enabledItems[enabledItems.length - 1]?.value;
        }

        const nextIndex = event.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex < 0) {
          return enabledItems[enabledItems.length - 1]?.value;
        }
        if (nextIndex >= enabledItems.length) {
          return enabledItems[0]?.value;
        }
        return enabledItems[nextIndex]?.value;
      });
    } else if (this.selectable() && (event.key === 'Enter' || event.key === ' ')) {
      const currentHighlightedValue = this.currentHighlightedValue();
      if (currentHighlightedValue !== null) {
        event.stopImmediatePropagation();
        event.preventDefault();
        this.onSelect(currentHighlightedValue);
      }
    }
  }

  public scrollToIndex(index: number) {
    this._scroller().scrollToIndex(index);
  }

  protected onSelect(value: NgnItemsValue<Items>) {
    if (this.multiple()) {
      const currentValue = (this.value() as Array<NgnItemsValue<Items>>) ?? [];
      if (!currentValue.includes(value)) {
        this.value.set([...currentValue, value] as ValueType<Items, Multiple>);
      } else {
        this.value.set(currentValue.filter(item => item !== value) as ValueType<Items, Multiple>);
      }
    } else {
      if (this.value() !== value) {
        this.value.set(value as ValueType<Items, Multiple>);
      }
    }
    this.itemClicked.emit(value);
    this.touched.set(true);
  }
}
