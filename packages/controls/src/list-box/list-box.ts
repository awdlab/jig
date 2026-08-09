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
} from '@awdlab/jig/api';
import { NgnTemplate } from '@awdlab/jig/api/ng';
import { NgnPt, provideSelf } from '@awdlab/jig/base';
import { NgnCheckbox } from '@awdlab/jig/checkbox';
import { I18n } from '@awdlab/jig/i18n';
import { NgnScroller, NgnScrollerItem } from '@awdlab/jig/scroller';
import { createConditionalSpinner } from '@awdlab/jig/spinner';
import { maybeCallback } from '@awdlab/jig/utils';
import { asyncComputed } from '@awdlab/jig/utils-ng';
import { listBoxControlTemplate } from '@awdlab/jig-themes/templates/list-box';

import { ListBoxTemplates, type ValueType } from './list-box-templates';

/** Keys that move the highlight. */
const NAVIGATION_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp'];

/** Paging step when no row has been rendered yet, so no row height can be measured. */
const DEFAULT_PAGE_SIZE = 10;

/** Home and End belong to the caret whenever they arrive from a text field the user has typed in. */
function movesCaret(event: KeyboardEvent): boolean {
  if (event.key !== 'Home' && event.key !== 'End') {
    return false;
  }
  const target = event.target;
  return (
    (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) && !!target.value
  );
}

/**
 * @category control
 */
@Component({
  selector: 'awd-list-box',
  templateUrl: './list-box.html',
  imports: [NgTemplateOutlet, NgnScroller, NgnScrollerItem, NgnCheckbox, NgnTemplate, NgnPt],
  providers: [provideSelf(NgnListBox)],
  host: {
    '[attr.tabIndex]': 'focussable() ? 0 : null',
    '(keydown)': 'onKeyDown($event)',
    '(focusout)': 'currentHighlightedValue.set(null)',
    role: 'listbox',
    '[attr.aria-activedescendant]': 'highlightedOptionId()',
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
    invalid: () => this.invalidState(),
    empty: () => !this.displayedItems().length,
    separator: () => this.separator(),
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
   * Whether a divider is drawn above each group, separating it from what precedes it.
   * Only affects grouped items; the first entry in the list never gets one.
   * @default false
   */
  public readonly separator = input(false, { transform: booleanAttribute });
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

  /** DOM id of an option row. */
  public optionId(value: NgnItemsValue<Items>): string {
    return `${this.inputId()}_option_${value}`;
  }

  /**
   * The option id the highlight currently sits on, or `null`. A host that owns focus
   * itself — a combobox input driving this list box — points its own
   * `aria-activedescendant` at this rather than rebuilding the id.
   */
  public readonly highlightedOptionId = computed(() => {
    const value = this.currentHighlightedValue();
    return value == null ? null : this.optionId(value);
  });

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
    if (NAVIGATION_KEYS.includes(event.key) && !movesCaret(event)) {
      event.stopPropagation();
      event.preventDefault();
      const flattenedItems = mapToItems(this.filteredItems());
      const paging = event.key === 'PageDown' || event.key === 'PageUp';
      // Measured outside the update callback, which must stay free of DOM reads.
      const step = paging ? this.pageSize() : 0;
      this.currentHighlightedValue.update(currentValue => {
        const enabledItems = flattenedItems.filter(item => !item.disabled);
        if (enabledItems.length === 0) {
          return null;
        }
        const lastIndex = enabledItems.length - 1;
        if (event.key === 'Home') {
          return enabledItems[0]?.value;
        }
        if (event.key === 'End') {
          return enabledItems[lastIndex]?.value;
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

        const forwards = event.key === 'ArrowDown' || event.key === 'PageDown';
        if (currentIndex === -1) {
          return forwards ? enabledItems[0]?.value : enabledItems[lastIndex]?.value;
        }

        // Arrows wrap around the ends; paging stops there, as a listbox is expected to.
        if (paging) {
          const paged = currentIndex + (forwards ? step : -step);
          return enabledItems[Math.min(lastIndex, Math.max(0, paged))]?.value;
        }
        const nextIndex = forwards ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex < 0) {
          return enabledItems[lastIndex]?.value;
        }
        if (nextIndex > lastIndex) {
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

  /** Rows that fit the scroll port, the step `PageUp`/`PageDown` moves by. */
  private pageSize(): number {
    const port = this.element.nativeElement;
    const row = port.querySelector<HTMLElement>('[role="option"]')?.offsetHeight ?? 0;
    // A measured port that fits a single row pages by one; only an unmeasurable one guesses.
    return row ? Math.max(1, Math.floor(port.clientHeight / row)) : DEFAULT_PAGE_SIZE;
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
    this.markTouched();
  }
}
