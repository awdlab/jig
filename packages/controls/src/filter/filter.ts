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
  viewChild,
} from '@angular/core';
import { executeFilter, getActiveFilterConditions, type JigItem } from '@awdlab/jig/api';
import { JigPt, provideSelf, ValueControlBase } from '@awdlab/jig/base';
import { JigButton } from '@awdlab/jig/button';
import { JigCalendar } from '@awdlab/jig/calendar';
import { I18n } from '@awdlab/jig/i18n';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigPopover, type PopoverOptions } from '@awdlab/jig/popover';
import { JigSelect } from '@awdlab/jig/select';
import { deepMerge, JigError } from '@awdlab/jig/utils';
import { filterControlTemplate } from '@awdlab/jig-themes/templates/filter';

import type {
  JigFilterCondition,
  JigFilterConditionConfig,
  JigFilterConfig,
  JigFilterDataType,
  JigFilterMode,
  JigFilterOperatorId,
} from './types';
import type { Anchor } from '@awdlab/jig/api/ng';

type ConditionInternal = {
  operator: JigFilterOperatorId;
  rawValue: string | null;
};

type OperatorDef = {
  id: JigFilterOperatorId;
  labelKey: string;
  requiresValue: boolean;
};

function defaultOperatorsForType(dataType: JigFilterDataType) {
  switch (dataType) {
    case 'string':
      return [
        { id: 'isEqual', labelKey: 'filter_operators_isEqual', requiresValue: true },
        { id: 'isNotEqual', labelKey: 'filter_operators_isNotEqual', requiresValue: true },
        { id: 'contains', labelKey: 'filter_operators_contains', requiresValue: true },
        { id: 'startsWith', labelKey: 'filter_operators_startsWith', requiresValue: true },
        { id: 'endsWith', labelKey: 'filter_operators_endsWith', requiresValue: true },
        { id: 'isEmpty', labelKey: 'filter_operators_isEmpty', requiresValue: false },
        { id: 'isNotEmpty', labelKey: 'filter_operators_isNotEmpty', requiresValue: false },
      ] as const satisfies OperatorDef[];
    case 'number':
      return [
        { id: 'isEqual', labelKey: 'filter_operators_isEqual', requiresValue: true },
        { id: 'isNotEqual', labelKey: 'filter_operators_isNotEqual', requiresValue: true },
        { id: 'greaterThan', labelKey: 'filter_operators_greaterThan', requiresValue: true },
        {
          id: 'greaterThanOrEqual',
          labelKey: 'filter_operators_greaterThanOrEqual',
          requiresValue: true,
        },
        { id: 'lessThan', labelKey: 'filter_operators_lessThan', requiresValue: true },
        {
          id: 'lessThanOrEqual',
          labelKey: 'filter_operators_lessThanOrEqual',
          requiresValue: true,
        },
      ] as const satisfies OperatorDef[];
    case 'date':
    case 'dateTime':
      return [
        { id: 'isEqual', labelKey: 'filter_operators_isEqual', requiresValue: true },
        { id: 'isNotEqual', labelKey: 'filter_operators_isNotEqual', requiresValue: true },
        { id: 'greaterThan', labelKey: 'filter_operators_after', requiresValue: true },
        { id: 'greaterThanOrEqual', labelKey: 'filter_operators_onOrAfter', requiresValue: true },
        { id: 'lessThan', labelKey: 'filter_operators_before', requiresValue: true },
        { id: 'lessThanOrEqual', labelKey: 'filter_operators_onOrBefore', requiresValue: true },
      ] as const satisfies OperatorDef[];
    case 'boolean':
      return [
        { id: 'isTrue', labelKey: 'filter_operators_isTrue', requiresValue: false },
        { id: 'isFalse', labelKey: 'filter_operators_isFalse', requiresValue: false },
      ] as const satisfies OperatorDef[];
    case 'custom':
      return [
        { id: 'custom', labelKey: 'filter_operators_custom', requiresValue: true },
      ] as const satisfies OperatorDef[];
    case 'list':
      return [
        { id: 'in', labelKey: 'filter_operators_in', requiresValue: true },
      ] as const satisfies OperatorDef[];
  }
}

/**
 * @category control
 */
@Component({
  selector: 'jig-filter',
  templateUrl: './filter.html',
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
  providers: [provideSelf(JigFilter)],
  host: {
    style: 'display: block;',
  },
})
export class JigFilter<T = unknown> extends ValueControlBase<'filter', JigFilterConfig | null> {
  protected readonly theme = this.injectThemeTemplate(filterControlTemplate, 'root');
  private readonly _i18n = inject(I18n);
  protected readonly i18n = this._i18n.translations;
  protected readonly unsafeI18n = this._i18n.unsafe.bind(this._i18n);
  private readonly _destroyRef = inject(DestroyRef);

  /**
   * Data to filter.
   * @default []
   */
  public readonly data = input<readonly T[]>([]);
  /**
   * Datatype of the values in {@link data}. Determines the available operators and editor UI.
   * @default 'string'
   */
  public readonly dataType = input<JigFilterDataType>('string');
  /**
   * Allows multiple conditions and a match mode (any/all).
   * @default false
   */
  public readonly allowMultiple = input(false, { transform: booleanAttribute });

  /**
   * Options for `dataType="list"`.
   * When provided, they are used as-is. When `null` or `undefined`, options are derived from {@link data}.
   * @default undefined
   */
  public readonly listOptions = input<readonly string[] | null | undefined>();

  /**
   * Controls how the filter is rendered.
   * - `inline`: renders the filter rows directly
   * - `input`: renders an input-like trigger that opens a popover (default)
   * - `headless`: renders only the popover and can be opened programmatically via {@link show}
   * @default 'input'
   */
  public readonly mode = input<JigFilterMode>('input');

  /**
   * Popover anchor used only in `headless` mode.
   * In `input` mode the anchor is the internal input-field.
   * @default null
   */
  public readonly anchor = input<Anchor | null>(null);

  /**
   * When true, the component will filter {@link data} locally and emit the filtered result
   * via {@link filterResultChange}. When false, only the filter configuration is emitted
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
          width: '360px',
          minHeight: '120px',
          maxHeight: '500px',
        },
        placement: 'bottom-start',
      },
      this.popoverOptions()
    )
  );

  /** Emits whenever the filter configuration changes. */
  public readonly filterChange = output<JigFilterConfig | null>();
  /** Emits the filtered data whenever local filtering is enabled. */
  public readonly filterResultChange = output<readonly T[]>();

  private readonly _popover = viewChild(JigPopover);

  /**
   * Internal working config that the template binds to.
   * In auto-apply mode, this syncs to value() via debounce.
   * In manual mode, only apply() commits this to value().
   */
  protected readonly workingConfig = signal<JigFilterConfig | null>(null);

  /** Snapshot of value() taken when popover opens in manual mode, for cancel to restore. */
  private _snapshotConfig: JigFilterConfig | null = null;

  /** Debounce timer handle for auto-apply. */
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

  /** Whether there is an active filter applied. */
  protected readonly hasActiveFilter = computed(() => {
    const cfg = this.value();
    if (!cfg) return false;
    if (cfg.dataType === 'list') {
      const raw = cfg.conditions[0]?.rawValue;
      if (!raw) return false;
      try {
        const parsed: unknown = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    }
    return this.activeConditionConfigs().length > 0;
  });

  private createCondition(operator: JigFilterOperatorId): ConditionInternal {
    return { operator, rawValue: null };
  }

  private defaultConfig(): JigFilterConfig {
    if (this.dataType() === 'list') {
      return {
        dataType: 'list',
        matchMode: 'all',
        conditions: <readonly JigFilterConditionConfig[]>[{ operator: 'in', rawValue: null }],
      };
    }

    const firstOp = this.operatorDefs()[0]?.id ?? 'isEqual';
    return {
      dataType: this.dataType(),
      matchMode: 'all',
      conditions: <readonly JigFilterConditionConfig[]>[
        {
          operator: firstOp,
          rawValue: null,
        },
      ],
    };
  }

  /**
   * Config used for UI rendering.
   * Always reads from workingConfig (the live editing state).
   * Falls back to a default config when null.
   */
  protected readonly templateConfig = computed<JigFilterConfig>(
    () => (this.workingConfig() ?? this.defaultConfig()) as JigFilterConfig
  );

  protected readonly templateListSelection = computed<readonly string[]>(() => {
    const cfg = this.templateConfig();
    if (cfg.dataType !== 'list') {
      return [];
    }
    const raw = cfg.conditions[0]?.rawValue;
    if (!raw) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(v => String(v)) : [];
    } catch {
      return [];
    }
  });

  protected readonly operatorDefs = computed(() => {
    const dt = this.dataType();
    const defs = defaultOperatorsForType(dt);
    if (dt === 'custom' && defs.length === 1 && defs[0]?.id === 'custom') {
      return defs;
    }
    return defs;
  });

  protected readonly operatorOptions = computed(() => {
    const options = this.operatorDefs().map(
      op =>
        <JigItem>{
          label: this.i18n[op.labelKey],
          value: op.id,
          testId: `filter-operator-${op.id}`,
        }
    );
    return options;
  });

  protected readonly autoListOptions = computed<readonly JigItem[]>(() => {
    const seen = new Set<string>();
    const items: Array<JigItem> = [];

    for (const raw of this.data()) {
      const s = String(raw);
      if (seen.has(s)) {
        continue;
      }
      seen.add(s);
      items.push({ label: s, value: s, testId: `filter-list-${s}` });
    }

    return items.sort((a, b) => {
      if (typeof a.label === 'string' && typeof b.label === 'string') {
        return a.label.localeCompare(b.label);
      }
      if (typeof a.label === 'function' && typeof b.label === 'function') {
        return a.label().localeCompare(b.label());
      }
      return 0;
    });
  });

  protected readonly resolvedListOptions = computed<readonly JigItem[]>(() => {
    const listOptions = this.listOptions();
    return listOptions
      ? listOptions.map(
          (opt): JigItem => ({
            label: opt,
            value: opt,
            testId: `filter-list-${opt}`,
          })
        )
      : this.autoListOptions();
  });

  protected readonly matchModeOptions: readonly JigItem[] = [
    { label: this.i18n['filter_match_all'], value: 'all', testId: 'filter-match-all' },
    { label: this.i18n['filter_match_any'], value: 'any', testId: 'filter-match-any' },
  ];

  protected readonly inputType = computed(() => {
    switch (this.dataType()) {
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      case 'dateTime':
        return 'datetime-local';
      default:
        return 'text';
    }
  });

  protected readonly isDateType = computed(
    () => this.dataType() === 'date' || this.dataType() === 'dateTime'
  );

  protected readonly isShowTime = computed(() => this.dataType() === 'dateTime');

  /** Parse a rawValue string to a Date for the calendar component. */
  protected parseRawDate(rawValue: string | null): Date | null {
    if (!rawValue) return null;
    const d = new Date(rawValue);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  /** Convert a Date from the calendar to a rawValue string. */
  protected dateToRaw(date: Date | null): string | null {
    if (!date || Number.isNaN(date.getTime())) return null;
    if (this.dataType() === 'dateTime') {
      // Format as YYYY-MM-DDTHH:mm for datetime-local compatibility
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
    // Format as YYYY-MM-DD for date
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  protected readonly summaryText = computed(() => {
    const currentValue = this.value();
    if (!currentValue) {
      return this.i18n['filter_noFilter']();
    }

    if (currentValue.dataType === 'list') {
      const selected = this.templateListSelection();
      if (selected.length === 0) {
        return this.i18n['filter_noFilter']();
      }
      if (selected.length === 1) {
        return selected[0] ?? this.i18n['filter_noFilter']();
      }
      return `${selected.length} ${this.i18n['filter_selected']()}`;
    }

    const active = this.activeConditionConfigs();
    if (active.length === 0) {
      return this.i18n['filter_noFilter']();
    }
    if (active.length === 1) {
      const c = active[0];

      const def = this.operatorDefs().find(d => d.id === c?.operator);
      const operatorLabel = def ? this.i18n._unsafe[def.labelKey]?.() : c?.operator;
      return c?.rawValue == null || c?.rawValue === ''
        ? operatorLabel
        : `${operatorLabel} "${c.rawValue}"`;
    }

    const matchLabel =
      currentValue.matchMode === 'all'
        ? this.i18n['filter_match_all']()
        : this.i18n['filter_match_any']();
    return `${active.length} ${this.i18n['filter_conditions']()} (${matchLabel})`;
  });

  protected readonly activeConditionConfigs = computed<readonly JigFilterConditionConfig[]>(() => {
    const cfg = this.value();
    if (!cfg || cfg.dataType === 'list') {
      return [];
    }
    const defs = this.operatorDefs();
    const defById = new Map(defs.map(d => [d.id, d] as const));

    return cfg.conditions.filter(c => {
      const def = defById.get(c.operator);
      const requiresValue = def?.requiresValue ?? true;
      return !requiresValue || (c.rawValue != null && c.rawValue !== '');
    });
  });

  protected readonly activeConditions = computed<readonly JigFilterCondition[]>(() => {
    const cfg = this.value();
    return cfg ? getActiveFilterConditions(cfg) : [];
  });

  protected readonly filteredData = computed<readonly T[]>(() => {
    if (!this.filterLocally()) {
      return this.data();
    }
    const cfg = this.value();
    if (!cfg) {
      return this.data();
    }
    return executeFilter(this.data(), cfg);
  });

  /** The current match mode label for the condition divider */
  protected readonly matchModeLabel = computed(() => {
    const cfg = this.templateConfig();
    return cfg.matchMode === 'all'
      ? this.i18n['filter_match_and']()
      : this.i18n['filter_match_or']();
  });

  constructor() {
    super();

    // Initialize workingConfig from initial value.
    this.workingConfig.set(this.value());

    effect(() => {
      this.filterChange.emit(this.value() ?? null);
    });

    effect(() => {
      if (!this.filterLocally()) {
        return;
      }
      this.filterResultChange.emit(this.filteredData());
    });

    effect(() => {
      if (!this.allowMultiple()) {
        const cfg = this.value();
        if (!cfg || cfg.dataType === 'list') {
          return;
        }
        if (cfg.conditions.length <= 1 && cfg.matchMode === 'all') {
          return;
        }
        this.value.set({
          ...cfg,
          matchMode: 'all',
          conditions: cfg.conditions.slice(0, 1),
        });
      }
    });

    effect(() => {
      const defs = this.operatorDefs();
      const first = defs[0];
      if (!first) {
        throw new JigError('filter', 'No operators available.');
      }
      const defIds = new Set(defs.map(d => d.id));

      const normalizeConditions = (
        conditions: readonly ConditionInternal[]
      ): readonly ConditionInternal[] => {
        let changed = false;
        const next = conditions.map(c => {
          if (defIds.has(c.operator)) {
            return c;
          }
          changed = true;
          return { ...c, operator: first.id, rawValue: null };
        });
        return changed ? next : conditions;
      };

      const cfg = this.value();
      if (!cfg || cfg.dataType === 'list') {
        return;
      }

      const current = cfg.conditions;
      const next = normalizeConditions(current);
      if (next !== current) {
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
    if (this.autoApply()) {
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
    // In manual mode, do nothing — wait for apply()
  }

  /** Updates the working config and optionally auto-applies. */
  private updateWorkingConfig(config: JigFilterConfig | null): void {
    this.workingConfig.set(config);
    this.commitWorkingConfig();
  }

  protected toggleMatchMode(): void {
    const cfg = this.templateConfig();
    if (cfg.dataType === 'list' || !this.allowMultiple()) {
      return;
    }
    const newMode = cfg.matchMode === 'all' ? 'any' : 'all';
    this.updateWorkingConfig({
      ...cfg,
      matchMode: newMode,
    });
  }

  protected setMatchMode(value: unknown): void {
    if (value === 'all' || value === 'any') {
      const cfg = this.templateConfig();
      if (cfg.dataType === 'list') {
        return;
      }
      this.updateWorkingConfig({
        ...cfg,
        matchMode: this.allowMultiple() ? value : 'all',
      });
    }
  }

  protected operatorRequiresValue(operator: JigFilterOperatorId): boolean {
    const def = this.operatorDefs().find(d => d.id === operator);
    return def?.requiresValue ?? true;
  }

  protected setOperator(index: number, operator: JigFilterOperatorId | null): void {
    if (!operator) {
      return;
    }
    const cfg = this.templateConfig();
    if (cfg.dataType === 'list') {
      return;
    }
    const next = cfg.conditions.slice();
    const existing = next[index];
    if (!existing) {
      return;
    }
    next[index] = {
      ...existing,
      operator,
      rawValue: this.operatorRequiresValue(operator) ? existing.rawValue : null,
    };
    this.updateWorkingConfig({
      ...cfg,
      matchMode: this.allowMultiple() ? cfg.matchMode : 'all',
      conditions: next,
    });
  }

  protected setRawValue(index: number, rawValue: string | null): void {
    const cfg = this.templateConfig();
    if (cfg.dataType === 'list') {
      return;
    }
    const next = cfg.conditions.slice();
    const existing = next[index];
    if (!existing) {
      return;
    }
    next[index] = { ...existing, rawValue };
    this.updateWorkingConfig({
      ...cfg,
      matchMode: this.allowMultiple() ? cfg.matchMode : 'all',
      conditions: next,
    });
  }

  protected setDateValue(index: number, date: Date | null): void {
    this.setRawValue(index, this.dateToRaw(date));
  }

  protected addCondition(): void {
    if (!this.allowMultiple()) {
      return;
    }
    const cfg = this.templateConfig();
    if (cfg.dataType === 'list') {
      return;
    }
    const firstOp = this.operatorDefs()[0]?.id ?? 'isEqual';
    this.updateWorkingConfig({
      ...cfg,
      matchMode: cfg.matchMode,
      conditions: [...cfg.conditions, this.createCondition(firstOp)],
    });
  }

  protected removeCondition(index: number): void {
    if (!this.allowMultiple()) {
      return;
    }
    const cfg = this.templateConfig();
    if (cfg.dataType === 'list') {
      return;
    }
    const current = cfg.conditions;
    if (current.length <= 1) {
      return;
    }
    const next = current.slice();
    next.splice(index, 1);
    this.updateWorkingConfig({
      ...cfg,
      matchMode: cfg.matchMode,
      conditions: next,
    });
  }

  protected setListSelection(value: unknown): void {
    const arr = Array.isArray(value)
      ? value.map(v => String(v))
      : value == null
        ? []
        : [String(value)];

    this.updateWorkingConfig({
      dataType: 'list',
      matchMode: 'all',
      conditions: <readonly JigFilterConditionConfig[]>[
        {
          operator: 'in',
          rawValue: arr.length > 0 ? JSON.stringify(arr) : null,
        },
      ],
    });
  }

  /** Applies the working config (manual mode). */
  protected apply(): void {
    const cfg = this.workingConfig();
    this.value.set(cfg);
    // Update snapshot so next cancel restores to this applied state
    this._snapshotConfig = cfg ? JSON.parse(JSON.stringify(cfg)) : null;
    if (this.mode() !== 'inline') {
      this.hide();
    }
  }

  /** Cancels changes and restores the snapshot (manual mode). */
  protected cancelChanges(): void {
    // Clear any pending debounce
    if (this._debounceTimer != null) {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
    }
    this.workingConfig.set(
      this._snapshotConfig ? JSON.parse(JSON.stringify(this._snapshotConfig)) : null
    );
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
      throw new JigError('filter', 'Cannot open an inline filter.');
    }
    if (this.mode() === 'headless' && !this.anchor()) {
      throw new JigError('filter', 'Headless mode requires an [anchor] input.');
    }
    const popover = this._popover();
    if (!popover) {
      throw new JigError('filter', 'Popover is not available.');
    }

    // Snapshot current value for cancel
    const val = this.value();
    this._snapshotConfig = val ? JSON.parse(JSON.stringify(val)) : null;
    // Reset working config to current value
    this.workingConfig.set(val);

    popover.show();
  }

  /** Hides the filter popup. Only works when {@link mode} is not `inline`. */
  public hide(): void {
    if (this.mode() === 'inline') {
      throw new JigError('filter', 'Cannot close an inline filter.');
    }
    this._popover()?.hide();
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (this.mode() !== 'inline') {
        this._popover()?.toggle();
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }
}
