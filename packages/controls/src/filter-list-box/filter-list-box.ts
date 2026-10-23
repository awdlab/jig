import {
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  numberAttribute,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  executeAttributeFilter,
  flatItems,
  formatConditionValue,
  getActiveFilterConditions,
  type FilterConfig,
  type JigItem,
  type JigItemsValue,
} from '@awdlab/jig/api';
import {
  JigAttributeFilter,
  type JigAttributeFilterConditionConfig,
  type JigAttributeFilterConfig,
  type JigFilterAttribute,
} from '@awdlab/jig/attribute-filter';
import { JigBadge } from '@awdlab/jig/badge';
import { JigPt, provideSelf } from '@awdlab/jig/base';
import { JigButton } from '@awdlab/jig/button';
import { JigChip } from '@awdlab/jig/chip';
import { defaultOperatorsForType } from '@awdlab/jig/filter';
import { I18n } from '@awdlab/jig/i18n';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigListBox } from '@awdlab/jig/list-box';
import { filterListBoxControlTemplate } from '@awdlab/jig-themes/templates/filter-list-box';

import { FilterListBoxTemplates } from './filter-list-box-templates';

import type { IconType } from '@awdlab/jig-custom-types';

/** An active condition, paired with the attribute it filters on and its parsed value. */
type ActiveCondition<T> = {
  /** Position in the configuration, so a chip can remove exactly this condition. */
  index: number;
  condition: JigAttributeFilterConditionConfig;
  attribute: JigFilterAttribute<T>;
  value: unknown;
};

/**
 * A {@link JigListBox} that ships its own search field — and, given
 * {@link JigFilterListBox.attributes}, a filter popover whose conditions show up
 * as removable chips above the list.
 *
 * Conditions narrow the items first, the search text narrows what is left, so
 * "email contains @gmail.com" and then typing a name compose as the user expects.
 *
 * @category control
 */
@Component({
  selector: 'jig-filter-list-box',
  templateUrl: './filter-list-box.html',
  imports: [
    JigPt,
    JigListBox,
    JigInputField,
    JigInput,
    JigIcon,
    JigButton,
    JigBadge,
    JigChip,
    JigAttributeFilter,
  ],
  providers: [provideSelf(JigFilterListBox)],
})
export class JigFilterListBox<
  Items extends readonly JigItem[],
  Multiple extends boolean = false,
> extends FilterListBoxTemplates<Items, Multiple> {
  protected readonly theme = this.injectThemeTemplate(filterListBoxControlTemplate, 'root');
  private readonly _i18n = inject(I18n);
  protected readonly i18n = this._i18n.translations;
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _filter = viewChild(JigAttributeFilter);
  protected readonly filterAnchor = viewChild<ElementRef<HTMLElement>>('filterTrigger');

  /**
   * The items to display. See {@link JigListBox.items}.
   */
  public readonly items = input.required<Items>();
  /**
   * Attributes the filter popover can build conditions on. Leave it out for a
   * plain searchable list — without it no filter trigger and no chips are rendered.
   * @default null
   */
  public readonly attributes = input<readonly JigFilterAttribute<Items[number]>[] | null>(null);
  /**
   * Two-way text the list is searched by, written {@link searchDebounce} after
   * the user stops typing.
   * @default ''
   */
  public readonly searchText = model('');
  /**
   * Milliseconds the typed text is held back before it reaches {@link searchText}.
   * @default 300
   */
  public readonly searchDebounce = input(300, { transform: numberAttribute });
  /**
   * Accepts a boolean that enables text search, or a `FilterConfig` to customize
   * which fields {@link searchText} matches.
   * @default true
   */
  public readonly filter = input<FilterConfig<Items[number]> | boolean>(true);
  /**
   * Whether active conditions are shown as removable chips above the list.
   * @default true
   */
  public readonly showActiveFilters = input(true, { transform: booleanAttribute });
  /**
   * Whether the filter accepts more than one condition and a match mode (any/all).
   * @default true
   */
  public readonly allowMultiple = input(true, { transform: booleanAttribute });
  /**
   * Whether the conditions are applied to {@link items} here. Set `false` for
   * server-side filtering — {@link filterChange} still fires, and the chips and
   * the badge still read the configuration.
   * @default true
   */
  public readonly filterLocally = input(true, { transform: booleanAttribute });
  /**
   * Whether multiple items can be selected. When enabled the value becomes an
   * array of item values.
   */
  public readonly multiple = input<Multiple>();
  /**
   * Whether a checkbox indicates selection state.
   * @default multiple()
   */
  public readonly checkbox = input<boolean>();
  /**
   * Whether items can be selected by the user.
   * @default true
   */
  public readonly selectable = input(true, { transform: booleanAttribute });
  /**
   * Whether a divider is drawn above each group, separating it from what precedes it.
   * @default false
   */
  public readonly separator = input(false, { transform: booleanAttribute });
  /**
   * Whether a spinner covers the list. Set this while items are being fetched.
   * @default false
   */
  public readonly loading = input(false, { transform: booleanAttribute });
  /**
   * Whether the list is virtualized.
   * @default false
   */
  public readonly virtual = input(false, { transform: booleanAttribute });
  /**
   * Row height when {@link virtual} is enabled.
   */
  public readonly itemHeight = input<number>();
  /**
   * Custom icon for the search field.
   */
  public readonly iconSearch = input<IconType>();
  /**
   * Custom icon for the filter trigger. See {@link attributes}.
   */
  public readonly iconFilter = input<IconType>();

  /**
   * Emitted whenever the filter configuration changes, `null` once no condition is left.
   */
  public readonly filterChange = output<JigAttributeFilterConfig | null>();
  /**
   * Emitted when an item is clicked, carrying that item's value.
   */
  public readonly itemClicked = output<JigItemsValue<Items>>();

  /** The live filter configuration — chips, badge and narrowing all read this. */
  protected readonly filterConfig = signal<JigAttributeFilterConfig | null>(null);
  /** The raw text in the search box, debounced into {@link searchText}. */
  protected readonly searchInput = linkedSignal(() => this.searchText());

  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

  /** The items the filter derives its `list` options from, groups flattened. */
  protected readonly filterData = computed(() => flatItems(this.items()) as Items[number][]);

  protected readonly activeConditions = computed<readonly ActiveCondition<Items[number]>[]>(() => {
    const config = this.filterConfig();
    const attributes = this.attributes();
    if (!config || !attributes) {
      return [];
    }
    return config.conditions.flatMap((condition, index) => {
      const attribute = attributes.find(a => a.key === condition.attribute);
      if (!attribute) {
        return [];
      }
      const [active] = getActiveFilterConditions({
        dataType: attribute.dataType,
        matchMode: 'all',
        conditions: [condition],
      });
      return active ? [{ index, condition, attribute, value: active.value }] : [];
    });
  });

  protected readonly chips = computed(() =>
    this.activeConditions().map(active => ({ index: active.index, label: this.chipLabel(active) }))
  );

  /** The trigger's name carries the badge count, which is decorative in the DOM. */
  protected readonly filterTriggerLabel = computed(() => {
    const label = this.i18n['filterListBox_openFilter']();
    const count = this.activeConditions().length;
    return count > 0 ? `${label} (${count})` : label;
  });

  protected readonly filtersActive = computed(
    () => !!this.searchText() || this.activeConditions().length > 0
  );

  protected readonly narrowedItems = computed<Items>(() => {
    const items = this.items();
    const attributes = this.attributes();
    const config = this.filterConfig();
    if (!this.filterLocally() || !attributes || !config) {
      return items;
    }
    return executeAttributeFilter(items, config, attributes, 'items') as unknown as Items;
  });

  constructor() {
    super();

    effect(() => {
      const text = this.searchInput();
      const debounce = this.searchDebounce();
      // A pending push is always stale once the box or the model moved on.
      this.clearDebounce();
      if (text === untracked(this.searchText)) {
        return;
      }
      if (debounce > 0) {
        this._debounceTimer = setTimeout(() => {
          this._debounceTimer = null;
          this.searchText.set(text);
        }, debounce);
      } else {
        this.searchText.set(text);
      }
    });

    effect(() => {
      this.filterChange.emit(this.filterConfig());
    });

    this._destroyRef.onDestroy(() => this.clearDebounce());
  }

  private clearDebounce(): void {
    if (this._debounceTimer != null) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }
  }

  private chipLabel({ condition, attribute, value }: ActiveCondition<Items[number]>): string {
    const defs = defaultOperatorsForType(attribute.dataType);
    const def = defs.find(d => d.id === condition.operator);
    const operator = def ? this._i18n.unsafe(def.labelKey)() : condition.operator;
    const label = typeof attribute.label === 'function' ? attribute.label() : attribute.label;
    if (def && !def.requiresValue) {
      return this.i18n['attributeFilter_chipNoValue']({ attribute: label, operator });
    }
    return this.i18n['attributeFilter_chip']({
      attribute: label,
      operator,
      value: formatConditionValue(value, attribute.dataType),
    });
  }

  /** Opens the filter popover. */
  public show(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }
    this._filter()?.show();
  }

  protected removeCondition(index: number): void {
    const config = this.filterConfig();
    if (!config || this.disabled() || this.readonly()) {
      return;
    }
    const conditions = config.conditions.filter((_, i) => i !== index);
    this.filterConfig.set(conditions.length > 0 ? { ...config, conditions } : null);
  }

  /**
   * Clears the search text and every condition. The selection is untouched.
   * Programmatic, so it also clears a disabled or readonly control — the
   * configuration has no input of its own to reset it through.
   */
  public clearFilters(): void {
    this.clearDebounce();
    this.searchInput.set('');
    this.searchText.set('');
    this.filterConfig.set(null);
  }
}
