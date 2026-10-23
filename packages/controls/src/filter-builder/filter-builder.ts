import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  executePropertyFilter,
  formatConditionValue,
  getActiveFilterConditions,
  type JigItem,
  parseFilterRawDate,
  filterPropertyId,
  readFilterPropertyValue,
} from '@awdlab/jig/api';
import { JigPt, provideSelf, ValueControlBase } from '@awdlab/jig/base';
import { JigButton } from '@awdlab/jig/button';
import { JigCalendar } from '@awdlab/jig/calendar';
import {
  defaultOperatorsForType,
  type JigFilterDataType,
  type JigFilterMode,
  type JigFilterOperatorId,
} from '@awdlab/jig/filter';
import { I18n } from '@awdlab/jig/i18n';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigPopover, type PopoverOptions } from '@awdlab/jig/popover';
import { JigSelect } from '@awdlab/jig/select';
import { deepMerge, JigError } from '@awdlab/jig/utils';
import { filterBuilderControlTemplate } from '@awdlab/jig-themes/templates/filter-builder';

import type {
  JigFilterBuilderConditionConfig,
  JigFilterBuilderConfig,
  JigFilterProperty,
} from './types';
import type { Anchor } from '@awdlab/jig/api/ng';

const NO_OPTIONS: readonly JigItem[] = [];
const NO_SELECTION: readonly string[] = [];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Formats a calendar date as the `date` / `datetime-local` raw value. */
function dateToRaw(date: Date | null, withTime: boolean): string | null {
  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return withTime ? `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}` : day;
}

function parseListRawValue(rawValue: string | null): readonly string[] {
  if (!rawValue) {
    return NO_SELECTION;
  }
  try {
    const parsed: unknown = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed.map(v => String(v)) : NO_SELECTION;
  } catch {
    return NO_SELECTION;
  }
}

/**
 * @category control
 */
@Component({
  selector: 'jig-filter-builder',
  templateUrl: './filter-builder.html',
  imports: [
    JigPt,
    NgTemplateOutlet,
    JigCalendar,
    JigInputField,
    JigInput,
    JigSelect,
    JigPopover,
    JigIcon,
    JigButton,
  ],
  providers: [provideSelf(JigFilterBuilder)],
  host: {
    style: 'display: block;',
  },
})
export class JigFilterBuilder<T = unknown, TData = T> extends ValueControlBase<
  'filterBuilder',
  JigFilterBuilderConfig | null
> {
  protected readonly theme = this.injectThemeTemplate(filterBuilderControlTemplate, 'root');
  private readonly _i18n = inject(I18n);
  protected readonly i18n = this._i18n.translations;
  private readonly _destroyRef = inject(DestroyRef);

  /**
   * Data to filter.
   * @default []
   */
  public readonly data = input<readonly T[]>([]);

  /**
   * Attributes a condition can filter on. Each row picks one, and its datatype
   * determines that row's operators and value editor.
   * @default []
   */
  public readonly properties = input<readonly JigFilterProperty<T, TData>[]>([]);

  /**
   * Allows multiple conditions and a match mode (any/all).
   * @default false
   */
  public readonly allowMultiple = input(false, { transform: booleanAttribute });

  /**
   * Controls how the filter is rendered.
   * - `inline`: renders the filter rows directly
   * - `input`: renders an input-like trigger that opens a popover (default)
   * - `headless`: renders only the popover and can be opened programmatically via {@link show}
   * @default 'input'
   */
  public readonly mode = input<JigFilterMode>('input');

  /**
   * Popover anchor used only in `headless` {@link mode}.
   * In `input` mode the anchor is the internal input-field.
   * @default null
   */
  public readonly anchor = input<Anchor | null>(null);

  /**
   * When true, the component filters {@link data} locally and emits the result via
   * {@link filterResultChange}. When false, only {@link filterChange} fires
   * (useful for server-side filtering).
   * @default true
   */
  public readonly filterLocally = input(true, { transform: booleanAttribute });

  /**
   * When true, filters apply automatically as the user types/selects.
   * When false, the user must click "Apply" to commit the filter.
   * @default true
   */
  public readonly autoApply = input(true, { transform: booleanAttribute });

  /**
   * Debounce time in milliseconds for auto-apply mode.
   * Only relevant when {@link autoApply} is `true`.
   * @default 300
   */
  public readonly autoApplyDebounce = input(300, { transform: numberAttribute });

  /**
   * Options for the popover (when {@link mode} is not `inline`).
   * @default {}
   */
  public readonly popoverOptions = input<PopoverOptions>({});
  protected readonly appliedPopoverOptions = computed(() =>
    deepMerge(
      <PopoverOptions>{
        sizeConstraints: {
          width: '460px',
          minHeight: '120px',
          maxHeight: '500px',
        },
        placement: 'bottom-start',
      },
      this.popoverOptions()
    )
  );

  /** Emits whenever the filter configuration changes. */
  public readonly filterChange = output<JigFilterBuilderConfig | null>();
  /** Emits the filtered data whenever {@link filterLocally} is enabled. */
  public readonly filterResultChange = output<readonly T[]>();

  private readonly _popover = viewChild(JigPopover);

  /**
   * Internal working config that the template binds to.
   * In auto-apply mode, this syncs to value() via debounce.
   * In manual mode, only apply() commits this to value().
   */
  protected readonly workingConfig = signal<JigFilterBuilderConfig | null>(null);

  /** Snapshot of value() taken when popover opens in manual mode, for cancel to restore. */
  private _snapshotConfig: JigFilterBuilderConfig | null = null;

  /** Debounce timer handle for auto-apply. */
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly _propertiesByKey = computed(
    () => new Map(this.properties().map(a => [filterPropertyId(a), a] as const))
  );

  private propertyFor(key: string): JigFilterProperty<T, TData> | undefined {
    return this._propertiesByKey().get(key);
  }

  protected readonly propertyOptions = computed<readonly JigItem[]>(() =>
    this.properties().map(
      a =>
        <JigItem>{
          label: a.label,
          value: filterPropertyId(a),
          testId: `filter-builder-property-${filterPropertyId(a)}`,
        }
    )
  );

  private readonly _operatorOptions = computed(
    () =>
      new Map(
        this.properties().map(a => {
          const defs = defaultOperatorsForType(a.dataType);
          return [
            filterPropertyId(a),
            defs.map(
              op =>
                <JigItem>{
                  label: this.i18n[op.labelKey],
                  value: op.id,
                  testId: `filter-builder-operator-${op.id}`,
                }
            ),
          ] as const;
        })
      )
  );

  protected operatorOptionsFor(propertyKey: string): readonly JigItem[] {
    return this._operatorOptions().get(propertyKey) ?? NO_OPTIONS;
  }

  private readonly _listOptions = computed(() => {
    const map = new Map<string, readonly JigItem[]>();
    for (const property of this.properties()) {
      if (property.dataType !== 'list') {
        continue;
      }
      const values =
        property.listOptions ??
        [
          ...new Set(
            this.data()
              .map(item => readFilterPropertyValue(item, property))
              .filter(value => value != null)
              .map(value => String(value))
          ),
        ].sort((a, b) => a.localeCompare(b));
      map.set(
        filterPropertyId(property),
        values.map(
          value => <JigItem>{ label: value, value, testId: `filter-builder-list-${value}` }
        )
      );
    }
    return map;
  });

  protected listOptionsFor(propertyKey: string): readonly JigItem[] {
    return this._listOptions().get(propertyKey) ?? NO_OPTIONS;
  }

  private createCondition(property: JigFilterProperty<T, TData>): JigFilterBuilderConditionConfig {
    const defs = defaultOperatorsForType(property.dataType);
    return {
      property: filterPropertyId(property),
      operator: defs[0]?.id ?? 'isEqual',
      rawValue: null,
    };
  }

  private defaultConfig(): JigFilterBuilderConfig {
    const first = this.properties()[0];
    return {
      matchMode: 'all',
      conditions: first ? [this.createCondition(first)] : [],
    };
  }

  /**
   * Config used for UI rendering.
   * Always reads from workingConfig (the live editing state).
   * Falls back to a default config when null.
   */
  protected readonly templateConfig = computed<JigFilterBuilderConfig>(
    () => this.workingConfig() ?? this.defaultConfig()
  );

  private readonly _listSelections = computed<readonly (readonly string[])[]>(() =>
    this.templateConfig().conditions.map(c => parseListRawValue(c.rawValue))
  );

  protected listSelection(index: number): readonly string[] {
    return this._listSelections()[index] ?? NO_SELECTION;
  }

  private dataTypeOf(propertyKey: string): JigFilterDataType | undefined {
    return this.propertyFor(propertyKey)?.dataType;
  }

  protected inputTypeFor(propertyKey: string): string {
    return this.dataTypeOf(propertyKey) === 'number' ? 'number' : 'text';
  }

  protected isListType(propertyKey: string): boolean {
    return this.dataTypeOf(propertyKey) === 'list';
  }

  protected isDateType(propertyKey: string): boolean {
    const dataType = this.dataTypeOf(propertyKey);
    return dataType === 'date' || dataType === 'dateTime';
  }

  protected isShowTime(propertyKey: string): boolean {
    return this.dataTypeOf(propertyKey) === 'dateTime';
  }

  /** Parse a rawValue string to a Date for the calendar component. */
  protected parseRawDate(rawValue: string | null): Date | null {
    return rawValue ? parseFilterRawDate(rawValue) : null;
  }

  protected propertyLabel(propertyKey: string): string {
    const label = this.propertyFor(propertyKey)?.label;
    return typeof label === 'function' ? label() : (label ?? propertyKey);
  }

  /** Conditions that actually narrow, each paired with its property and parsed value. */
  private readonly _activeConditions = computed(() => {
    const cfg = this.value();
    if (!cfg) {
      return [];
    }
    return cfg.conditions.flatMap(condition => {
      const property = this.propertyFor(condition.property);
      if (!property) {
        return [];
      }
      const [active] = getActiveFilterConditions({
        dataType: property.dataType,
        matchMode: 'all',
        conditions: [condition],
      });
      return active ? [{ condition, property, value: active.value }] : [];
    });
  });

  protected readonly summaryText = computed(() => {
    const active = this._activeConditions();
    if (active.length === 0) {
      return this.i18n['filter_noFilter']();
    }
    const only = active.length === 1 ? active[0] : undefined;
    if (only) {
      const defs = defaultOperatorsForType(only.property.dataType);
      const def = defs.find(d => d.id === only.condition.operator);
      const operatorLabel = def ? this._i18n.unsafe(def.labelKey)() : only.condition.operator;
      const prefix = `${this.propertyLabel(only.condition.property)} ${operatorLabel}`;
      if (def && !def.requiresValue) {
        return prefix;
      }
      return `${prefix} "${formatConditionValue(only.value, only.property.dataType)}"`;
    }

    const matchLabel =
      this.value()?.matchMode === 'all'
        ? this.i18n['filter_match_all']()
        : this.i18n['filter_match_any']();
    return `${active.length} ${this.i18n['filter_conditions']()} (${matchLabel})`;
  });

  protected readonly filteredData = computed<readonly T[]>(() => {
    if (!this.filterLocally()) {
      return this.data();
    }
    const cfg = this.value();
    if (!cfg) {
      return this.data();
    }
    return executePropertyFilter(this.data(), cfg, this.properties());
  });

  /** The current match mode label for the condition divider. */
  protected readonly matchModeLabel = computed(() =>
    this.templateConfig().matchMode === 'all'
      ? this.i18n['filter_match_and']()
      : this.i18n['filter_match_or']()
  );

  constructor() {
    super();

    // Initialize workingConfig from initial value.
    this.workingConfig.set(this.value());

    effect(() => {
      this.filterChange.emit(this.value() ?? null);
    });

    // A config written from outside replaces the rows. The control's own commits already hold that
    // config in workingConfig, a pending debounce means the user is mid-edit, and in manual mode a
    // touched editor keeps its pending rows.
    effect(() => {
      const cfg = this.value();
      untracked(() => {
        if (!this.autoApply() && this.workingConfig() != null) {
          return;
        }
        if (this._debounceTimer != null || cfg === this.workingConfig()) {
          return;
        }
        this.workingConfig.set(cfg);
        if (!this.autoApply()) {
          // The untouched editor now shows this config, so cancel restores to it.
          this._snapshotConfig = cfg ? structuredClone(cfg) : null;
        }
      });
    });

    effect(() => {
      if (!this.filterLocally()) {
        return;
      }
      this.filterResultChange.emit(this.filteredData());
    });

    effect(() => {
      if (this.allowMultiple()) {
        return;
      }
      const cfg = this.value();
      if (!cfg || (cfg.conditions.length <= 1 && cfg.matchMode === 'all')) {
        return;
      }
      this.value.set({ ...cfg, matchMode: 'all', conditions: cfg.conditions.slice(0, 1) });
    });

    effect(() => {
      const cfg = this.value();
      if (!cfg) {
        return;
      }
      let changed = false;
      const next = cfg.conditions.map(c => {
        const property = this.propertyFor(c.property);
        if (!property) {
          return c;
        }
        const defs = defaultOperatorsForType(property.dataType);
        if (defs.some(d => d.id === c.operator)) {
          return c;
        }
        changed = true;
        return { ...c, operator: defs[0]?.id ?? 'isEqual', rawValue: null };
      });
      if (changed) {
        this.value.set({ ...cfg, conditions: next });
      }
    });

    this._destroyRef.onDestroy(() => {
      if (this._debounceTimer != null) {
        clearTimeout(this._debounceTimer);
      }
    });
  }

  /**
   * Commits the working config to the actual value, with optional debounce.
   * Called after every working config change.
   */
  private commitWorkingConfig(): void {
    if (!this.autoApply()) {
      return;
    }
    if (this._debounceTimer != null) {
      clearTimeout(this._debounceTimer);
    }
    const debounceMs = this.autoApplyDebounce();
    if (debounceMs > 0) {
      this._debounceTimer = setTimeout(() => {
        this._debounceTimer = null;
        this.value.set(this.workingConfig());
      }, debounceMs);
    } else {
      this.value.set(this.workingConfig());
    }
  }

  /** Updates the working config and optionally auto-applies. */
  private updateWorkingConfig(config: JigFilterBuilderConfig | null): void {
    this.workingConfig.set(config);
    this.commitWorkingConfig();
  }

  private updateCondition(index: number, condition: JigFilterBuilderConditionConfig): void {
    const cfg = this.templateConfig();
    const next = cfg.conditions.slice();
    next[index] = condition;
    this.updateWorkingConfig({
      ...cfg,
      matchMode: this.allowMultiple() ? cfg.matchMode : 'all',
      conditions: next,
    });
  }

  protected toggleMatchMode(): void {
    if (!this.allowMultiple()) {
      return;
    }
    const cfg = this.templateConfig();
    this.updateWorkingConfig({ ...cfg, matchMode: cfg.matchMode === 'all' ? 'any' : 'all' });
  }

  protected operatorRequiresValue(propertyKey: string, operator: JigFilterOperatorId): boolean {
    const property = this.propertyFor(propertyKey);
    if (!property) {
      return true;
    }
    const defs = defaultOperatorsForType(property.dataType);
    return defs.find(d => d.id === operator)?.requiresValue ?? true;
  }

  /** Switches a row's property, resetting operator and value when the datatype changes. */
  protected setProperty(index: number, propertyKey: unknown): void {
    if (typeof propertyKey !== 'string') {
      return;
    }
    const key = propertyKey;
    const existing = this.templateConfig().conditions[index];
    const property = this.propertyFor(key);
    if (!existing || !property || existing.property === key) {
      return;
    }
    const sameDataType = this.dataTypeOf(existing.property) === property.dataType;
    this.updateCondition(
      index,
      sameDataType ? { ...existing, property: key } : this.createCondition(property)
    );
  }

  protected setOperator(index: number, operator: JigFilterOperatorId | null): void {
    const existing = this.templateConfig().conditions[index];
    if (!operator || !existing) {
      return;
    }
    this.updateCondition(index, {
      ...existing,
      operator,
      rawValue: this.operatorRequiresValue(existing.property, operator) ? existing.rawValue : null,
    });
  }

  protected setRawValue(index: number, rawValue: string | null): void {
    const existing = this.templateConfig().conditions[index];
    if (!existing) {
      return;
    }
    this.updateCondition(index, { ...existing, rawValue });
  }

  protected setDateValue(index: number, date: Date | null): void {
    const propertyKey = this.templateConfig().conditions[index]?.property ?? '';
    this.setRawValue(index, dateToRaw(date, this.dataTypeOf(propertyKey) === 'dateTime'));
  }

  protected setListSelection(index: number, value: unknown): void {
    const selected = Array.isArray(value)
      ? value.map(v => String(v))
      : value == null
        ? []
        : [String(value)];
    this.setRawValue(index, selected.length > 0 ? JSON.stringify(selected) : null);
  }

  protected addCondition(): void {
    const first = this.properties()[0];
    if (!this.allowMultiple() || !first) {
      return;
    }
    const cfg = this.templateConfig();
    this.updateWorkingConfig({
      ...cfg,
      conditions: [...cfg.conditions, this.createCondition(first)],
    });
  }

  protected removeCondition(index: number): void {
    if (!this.allowMultiple()) {
      return;
    }
    const cfg = this.templateConfig();
    if (cfg.conditions.length <= 1) {
      return;
    }
    const next = cfg.conditions.slice();
    next.splice(index, 1);
    this.updateWorkingConfig({ ...cfg, conditions: next });
  }

  /** Applies the working config (manual mode). */
  protected apply(): void {
    const cfg = this.workingConfig();
    this.value.set(cfg);
    // Update snapshot so next cancel restores to this applied state
    this._snapshotConfig = cfg ? structuredClone(cfg) : null;
    if (this.mode() !== 'inline') {
      this.hide();
    }
  }

  /** Cancels changes and restores the snapshot (manual mode). */
  protected cancelChanges(): void {
    if (this._debounceTimer != null) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }
    this.workingConfig.set(this._snapshotConfig ? structuredClone(this._snapshotConfig) : null);
    if (this.mode() !== 'inline') {
      this.hide();
    }
  }

  protected clear(): void {
    this.updateWorkingConfig(null);
    if (!this.autoApply()) {
      // In manual mode, also commit clear immediately
      this.value.set(null);
      this._snapshotConfig = null;
    }
    if (this.mode() !== 'inline') {
      this.hide();
    }
  }

  /** Shows the filter popup. Only works when {@link mode} is not `inline`. */
  public show(): void {
    if (this.mode() === 'inline') {
      throw new JigError('filterBuilder', 'Cannot open an inline filter.');
    }
    if (this.mode() === 'headless' && !this.anchor()) {
      throw new JigError('filterBuilder', 'Headless mode requires an [anchor] input.');
    }
    const popover = this._popover();
    if (!popover) {
      throw new JigError('filterBuilder', 'Popover is not available.');
    }

    const val = this.value();
    this._snapshotConfig = val ? structuredClone(val) : null;
    this.workingConfig.set(val);

    popover.show();
  }

  /** Hides the filter popup. Only works when {@link mode} is not `inline`. */
  public hide(): void {
    if (this.mode() === 'inline') {
      throw new JigError('filterBuilder', 'Cannot close an inline filter.');
    }
    this._popover()?.hide();
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.mode() !== 'inline') {
      this._popover()?.toggle();
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
