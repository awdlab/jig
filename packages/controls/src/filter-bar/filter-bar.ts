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
  executePropertyFilter,
  filterPropertyId,
  formatConditionValue,
  getActiveFilterConditions,
  readFilterPropertyValue,
  stringMatches,
} from '@awdlab/jig/api';
import { JigBadge } from '@awdlab/jig/badge';
import { JigPt, provideSelf, ValueControlBase } from '@awdlab/jig/base';
import { JigButton } from '@awdlab/jig/button';
import { JigChip } from '@awdlab/jig/chip';
import { defaultOperatorsForType } from '@awdlab/jig/filter-field';
import {
  JigFilterBuilder,
  type JigFilterBuilderConditionConfig,
  type JigFilterBuilderConfig,
  type JigFilterProperty,
} from '@awdlab/jig/filter-builder';
import { I18n } from '@awdlab/jig/i18n';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { filterBarControlTemplate } from '@awdlab/jig-themes/templates/filter-bar';

import type { IconType } from '@awdlab/jig-custom-types';

/** An active condition, paired with the property it filters on and its parsed value. */
type ActiveCondition<TItem, TData> = {
  /** Position in the configuration, so a chip can remove exactly this condition. */
  index: number;
  condition: JigFilterBuilderConditionConfig;
  property: JigFilterProperty<TItem, TData>;
  value: unknown;
};

/**
 * A search field and, given {@link JigFilterBar.properties}, a filter trigger whose
 * conditions show up as removable chips — the header strip for any display.
 *
 * Put whatever you like underneath: a list box, a tree, cards of your own. With
 * {@link JigFilterBar.filterLocally} on it narrows {@link JigFilterBar.data} and
 * emits the result; off, it emits only the serializable configuration and the
 * search text so a server can do the work.
 *
 * @category control
 */
@Component({
  selector: 'jig-filter-bar',
  templateUrl: './filter-bar.html',
  imports: [
    JigPt,
    JigInputField,
    JigInput,
    JigIcon,
    JigButton,
    JigBadge,
    JigChip,
    JigFilterBuilder,
  ],
  providers: [provideSelf(JigFilterBar)],
})
export class JigFilterBar<T = unknown, TData = T> extends ValueControlBase<
  'filterBar',
  JigFilterBuilderConfig | null
> {
  protected readonly theme = this.injectThemeTemplate(filterBarControlTemplate, 'root');
  private readonly _i18n = inject(I18n);
  protected readonly i18n = this._i18n.translations;
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _filter = viewChild(JigFilterBuilder);
  protected readonly filterAnchor = viewChild<ElementRef<HTMLElement>>('filterTrigger');

  /**
   * The data the bar filters and derives `list` options from. Pass grouped items
   * flattened — `flatItems(items)` — so every leaf contributes its options.
   * @default []
   */
  public readonly data = input<readonly T[]>([]);
  /**
   * Properties the filter popover can build conditions on. Leave it out for a
   * plain search box — without it no filter trigger and no chips are rendered.
   * @default null
   */
  public readonly properties = input<readonly JigFilterProperty<T, TData>[] | null>(null);
  /**
   * Two-way search text, written {@link searchDebounce} after the user stops typing.
   * @default ''
   */
  public readonly searchText = model('');
  /**
   * Milliseconds the typed text is held back before it reaches {@link searchText}.
   * @default 300
   */
  public readonly searchDebounce = input(300, { transform: numberAttribute });
  /**
   * Reads the text {@link searchText} is matched against. Defaults to every
   * declared {@link properties} value, so the search covers what the filter can.
   */
  public readonly searchSelector = input<(item: T) => string>();
  /**
   * Property holding an item's children, so local filtering keeps a group whose
   * children survive. See {@link filterLocally}.
   */
  public readonly childrenKey = input<keyof T>();
  /**
   * Whether the user can add more than one condition.
   * @default true
   */
  public readonly allowMultiple = input(true, { transform: booleanAttribute });
  /**
   * Whether active conditions are shown as removable chips.
   * @default true
   */
  public readonly showActiveFilters = input(true, { transform: booleanAttribute });
  /**
   * Whether {@link data} is narrowed here and emitted via {@link filterResultChange}.
   * Turn it off to filter on a server from {@link filterChange} and {@link searchText}.
   * @default true
   */
  public readonly filterLocally = input(true, { transform: booleanAttribute });
  /**
   * Custom icon for the search field.
   */
  public readonly iconSearch = input<IconType>();
  /**
   * Custom icon for the filter trigger. See {@link properties}.
   */
  public readonly iconFilter = input<IconType>();

  /**
   * Emitted whenever the filter configuration changes, `null` once no condition is left.
   */
  public readonly filterChange = output<JigFilterBuilderConfig | null>();
  /**
   * Emitted with the narrowed data while {@link filterLocally} is on.
   */
  public readonly filterResultChange = output<readonly T[]>();

  /** The live filter configuration — chips, badge and narrowing all read this. */
  protected readonly filterConfig = signal<JigFilterBuilderConfig | null>(null);
  /** The raw text in the search box, debounced into {@link searchText}. */
  protected readonly searchInput = linkedSignal(() => this.searchText());

  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly activeConditions = computed<readonly ActiveCondition<T, TData>[]>(() => {
    const config = this.filterConfig();
    const properties = this.properties();
    if (!config || !properties) {
      return [];
    }
    return config.conditions.flatMap((condition, index) => {
      const property = properties.find(p => filterPropertyId(p) === condition.property);
      if (!property) {
        return [];
      }
      const [active] = getActiveFilterConditions({
        dataType: property.dataType,
        matchMode: 'all',
        conditions: [condition],
      });
      return active ? [{ index, condition, property, value: active.value }] : [];
    });
  });

  protected readonly chips = computed(() =>
    this.activeConditions().map(active => ({ index: active.index, label: this.chipLabel(active) }))
  );

  /** The trigger's name carries the badge count, which is decorative in the DOM. */
  protected readonly filterTriggerLabel = computed(() => {
    const label = this.i18n['filterBar_openFilter']();
    const count = this.activeConditions().length;
    return count > 0 ? `${label} (${count})` : label;
  });

  /** Whether anything is narrowing — useful for your own empty state. */
  public readonly filtersActive = computed(
    () => !!this.searchText() || this.activeConditions().length > 0
  );

  /** The data narrowed by the conditions and then by the search text. */
  public readonly filtered = computed<readonly T[]>(() => {
    const data = this.data();
    if (!this.filterLocally()) {
      return data;
    }
    const properties = this.properties();
    const config = this.filterConfig();
    const narrowed =
      properties && config
        ? executePropertyFilter(data, config, properties, this.childrenKey())
        : data;
    return this.matchSearch(narrowed);
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

    effect(() => {
      if (this.filterLocally()) {
        this.filterResultChange.emit(this.filtered());
      }
    });

    this._destroyRef.onDestroy(() => this.clearDebounce());
  }

  private clearDebounce(): void {
    if (this._debounceTimer != null) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }
  }

  /** Keeps the items whose searchable text contains the search term. */
  private matchSearch(data: readonly T[]): readonly T[] {
    const text = this.searchText().trim().toLowerCase();
    if (!text) {
      return data;
    }
    const selector = this.searchSelector();
    const properties = this.properties() ?? [];
    const haystack = (item: T): string => {
      if (selector) {
        return selector(item);
      }
      if (properties.length) {
        return properties.map(p => String(readFilterPropertyValue(item, p) ?? '')).join(' ');
      }
      // Nothing declared: search whatever the item carries, so a bare search box still works.
      const source = (item as { data?: unknown } | null)?.data ?? item;
      return source && typeof source === 'object'
        ? Object.values(source)
            .filter(v => v != null && typeof v !== 'object')
            .join(' ')
        : String(source ?? '');
    };
    return data.filter(item => stringMatches(haystack(item).toLowerCase(), text, 'contains'));
  }

  private chipLabel({ condition, property, value }: ActiveCondition<T, TData>): string {
    const defs = defaultOperatorsForType(property.dataType);
    const def = defs.find(d => d.id === condition.operator);
    const operator = def ? this.i18n[def.labelKey]() : condition.operator;
    const label = typeof property.label === 'function' ? property.label() : property.label;
    if (def && !def.requiresValue) {
      return this.i18n['filterBuilder_chipNoValue']({ property: label, operator });
    }
    return this.i18n['filterBuilder_chip']({
      property: label,
      operator,
      value: formatConditionValue(value, property.dataType),
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
   * Clears the search text and every condition.
   * Programmatic, so it also clears a disabled or readonly control — the
   * configuration has no input of its own to reset it through.
   */
  public clear(): void {
    this.clearDebounce();
    this.searchInput.set('');
    this.searchText.set('');
    this.filterConfig.set(null);
  }
}
