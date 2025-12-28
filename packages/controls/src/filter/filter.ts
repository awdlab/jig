import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { executeFilter, getActiveFilterConditions, NgnItem } from '@ngneers/controls/api';
import { type Anchor } from '@ngneers/controls/api/ng';
import { provideSelf, ValueControlBase } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnPopover, PopoverOptions } from '@ngneers/controls/popover';
import { NgnSelect } from '@ngneers/controls/select';
import { deepMerge, NgnError } from '@ngneers/controls/utils';
import { NgnGlobal } from '@ngneers/controls/utils-ng';
import { filterControlTemplate } from '@ngneers/controls-themes/templates/filter';

import {
  NgnFilterCondition,
  NgnFilterConditionConfig,
  NgnFilterConfig,
  NgnFilterDataType,
  NgnFilterMode,
  NgnFilterMatchMode,
  NgnFilterOperatorId,
  NgnFilterOutput,
} from './types';

type ConditionInternal = {
  id: string;
  operator: NgnFilterOperatorId;
  rawValue: string | null;
};

type FilterState = {
  matchMode: NgnFilterMatchMode;
  conditions: readonly ConditionInternal[];
  listSelection: readonly string[];
};

type OperatorDef = {
  id: NgnFilterOperatorId;
  labelKey: string;
  requiresValue: boolean;
};

function defaultOperatorsForType(dataType: NgnFilterDataType): readonly OperatorDef[] {
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
      ];
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
      ];
    case 'date':
    case 'dateTime':
      return [
        { id: 'isEqual', labelKey: 'filter_operators_isEqual', requiresValue: true },
        { id: 'isNotEqual', labelKey: 'filter_operators_isNotEqual', requiresValue: true },
        { id: 'greaterThan', labelKey: 'filter_operators_after', requiresValue: true },
        { id: 'greaterThanOrEqual', labelKey: 'filter_operators_onOrAfter', requiresValue: true },
        { id: 'lessThan', labelKey: 'filter_operators_before', requiresValue: true },
        { id: 'lessThanOrEqual', labelKey: 'filter_operators_onOrBefore', requiresValue: true },
      ];
    case 'boolean':
      return [
        { id: 'isTrue', labelKey: 'filter_operators_isTrue', requiresValue: false },
        { id: 'isFalse', labelKey: 'filter_operators_isFalse', requiresValue: false },
      ];
    case 'custom':
      return [{ id: 'custom', labelKey: 'filter_operators_custom', requiresValue: true }];
    case 'list':
      return [{ id: 'in', labelKey: 'filter_operators_in', requiresValue: true }];
  }
}

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-filter',
  templateUrl: './filter.html',
  imports: [
    NgClass,
    NgTemplateOutlet,
    NgnInputField,
    NgnInput,
    NgnSelect,
    NgnPopover,
    NgnIcon,
    NgnButton,
  ],
  providers: [provideSelf(NgnFilter)],
  host: {
    '[class]': 'theme.class("")',
    style: 'display: block;',
  },
})
export class NgnFilter<T = unknown> extends ValueControlBase<'filter', NgnFilterConfig> {
  protected readonly theme = this.injectThemeTemplate(filterControlTemplate);
  protected readonly i18n = inject(I18n).translations;

  /** Data to filter. */
  public readonly data = input<readonly T[]>([]);
  /** Datatype of the values in {@link data}. */
  public readonly dataType = input<NgnFilterDataType>('string');
  /** Allows multiple conditions and a match mode (any/all). */
  public readonly allowMultiple = input(false, { transform: booleanAttribute });

  /**
   * Options for `dataType="list"`.
   * When provided, they are used as-is. When `null` or `undefined`, options are derived from {@link data}.
   */
  public readonly listOptions = input<readonly string[] | null | undefined>();

  /**
   * Controls how the filter is rendered.
   * - `inline`: renders the filter rows directly
   * - `input`: renders an input-like trigger that opens a popover (default)
   * - `headless`: renders only the popover and can be opened programmatically via {@link show}
   */
  public readonly mode = input<NgnFilterMode>('input');

  /**
   * Popover anchor used only in `headless` mode.
   * In `input` mode the anchor is the internal input-field.
   */
  public readonly anchor = input<Anchor | null>(null);

  /**
   * When true, the component will filter {@link data} locally and emit the filtered result.
   * When false, only the filter configuration is emitted (useful for server-side filtering).
   */
  public readonly filterLocally = input(true, { transform: booleanAttribute });

  /** Options for the popover (when {@link mode} is not `inline`). */
  public readonly popoverOptions = input<PopoverOptions>({});
  protected readonly appliedPopoverOptions = computed(() =>
    deepMerge(
      <PopoverOptions>{
        sizeConstraints: {
          width: '250px',
          minHeight: '200px',
          maxHeight: '500px',
        },
        placement: 'bottom-start',
      },
      this.popoverOptions()
    )
  );

  /** Emits whenever the filter configuration changes. */
  public readonly filterChange = output<NgnFilterConfig | null>();
  /** Emits the filtered data whenever local filtering is enabled. */
  public readonly filterResultChange = output<readonly T[]>();

  private readonly _popover = viewChild(NgnPopover);
  private readonly _global = inject(NgnGlobal);

  // Draft state edited by the UI. Changes are only committed via apply().
  protected readonly draftState = signal<FilterState>(this.createInitialState());

  // Applied state used for summary + output + local filtering.
  protected readonly appliedState = signal<FilterState>(this.createInitialState());

  private nextConditionId(): string {
    return `ngn-id-${this._global.nextElementId++}`;
  }

  private createCondition(operator: NgnFilterOperatorId): ConditionInternal {
    return { id: this.nextConditionId(), operator, rawValue: null };
  }

  private createInitialState(): FilterState {
    return {
      matchMode: 'all',
      conditions: [this.createCondition('isEqual')],
      listSelection: [],
    };
  }

  protected readonly operatorDefs = computed(() => {
    const dt = this.dataType();
    const defs = defaultOperatorsForType(dt);
    if (dt === 'custom' && defs.length === 1 && defs[0].id === 'custom') {
      return defs;
    }
    return defs;
  });

  protected readonly operatorOptions = computed(() => {
    const options = this.operatorDefs().map(
      op =>
        <NgnItem>{
          label: op.labelKey,
          translate: true,
          value: op.id,
          testId: `filter-operator-${op.id}`,
        }
    );
    return options;
  });

  protected readonly autoListOptions = computed<readonly NgnItem[]>(() => {
    const seen = new Set<string>();
    const items: Array<NgnItem> = [];

    for (const raw of this.data()) {
      const s = String(raw);
      if (seen.has(s)) {
        continue;
      }
      seen.add(s);
      items.push({ label: s, value: s, testId: `filter-list-${s}` });
    }

    return items.sort((a, b) => a.label.localeCompare(b.label));
  });

  protected readonly resolvedListOptions = computed<readonly NgnItem[]>(() => {
    const listOptions = this.listOptions();
    return listOptions
      ? listOptions.map(
          (opt): NgnItem => ({
            label: opt,
            value: opt,
            testId: `filter-list-${opt}`,
          })
        )
      : this.autoListOptions();
  });

  protected readonly matchModeOptions: readonly NgnItem[] = [
    { label: 'filter_match_all', translate: true, value: 'all', testId: 'filter-match-all' },
    { label: 'filter_match_any', translate: true, value: 'any', testId: 'filter-match-any' },
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

  protected readonly summaryText = computed(() => {
    if (this.dataType() === 'list') {
      const selected = this.appliedState().listSelection;
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

      const def = this.operatorDefs().find(d => d.id === c.operator);
      const operatorLabel = def ? this.i18n[def.labelKey]() : c.operator;
      return c.rawValue == null || c.rawValue === ''
        ? operatorLabel
        : `${operatorLabel} ${c.rawValue}`;
    }

    const matchLabel =
      this.appliedState().matchMode === 'all'
        ? this.i18n['filter_match_all']()
        : this.i18n['filter_match_any']();
    return `${active.length} ${this.i18n['filter_conditions']()} (${matchLabel})`;
  });

  protected readonly configValue = computed<NgnFilterConfig>(() =>
    this.dataType() === 'list'
      ? {
          dataType: 'list',
          matchMode: 'all',
          conditions: <readonly NgnFilterConditionConfig[]>[
            {
              operator: 'in',
              rawValue:
                this.appliedState().listSelection.length > 0
                  ? JSON.stringify(this.appliedState().listSelection)
                  : null,
            },
          ],
        }
      : {
          dataType: this.dataType(),
          matchMode: this.allowMultiple() ? this.appliedState().matchMode : 'all',
          conditions: this.appliedState().conditions.map(
            (c): NgnFilterConditionConfig => ({
              operator: c.operator,
              rawValue: c.rawValue,
            })
          ),
        }
  );

  protected readonly activeConditionConfigs = computed<readonly NgnFilterConditionConfig[]>(() => {
    const defs = this.operatorDefs();
    const defById = new Map(defs.map(d => [d.id, d] as const));

    return this.appliedState().conditions.filter(c => {
      const def = defById.get(c.operator);
      const requiresValue = def?.requiresValue ?? true;
      return !requiresValue || (c.rawValue != null && c.rawValue !== '');
    });
  });

  protected readonly activeConditions = computed<readonly NgnFilterCondition[]>(() => {
    return getActiveFilterConditions(this.configValue());
  });

  protected readonly filteredData = computed<readonly T[]>(() => {
    if (!this.filterLocally()) {
      return this.data();
    }
    return executeFilter(this.data(), this.configValue());
  });

  protected readonly outputValue = computed<NgnFilterOutput<T>>(() => ({
    ...this.configValue(),
    activeConditions: this.activeConditions(),
    filtered: this.filteredData(),
  }));

  constructor() {
    super();

    // Initial commit so consumers get a starting value/config.
    this.applyDraft({ close: false });

    effect(() => {
      if (!this.allowMultiple()) {
        this.draftState.update(state => ({
          ...state,
          matchMode: 'all',
          conditions: state.conditions.slice(0, 1),
        }));
        this.appliedState.update(state => ({
          ...state,
          matchMode: 'all',
          conditions: state.conditions.slice(0, 1),
        }));
      }
    });

    effect(() => {
      const defs = this.operatorDefs();
      const first = defs[0];
      if (!first) {
        throw new NgnError('filter', 'No operators available.');
      }
      // Ensure all conditions use a valid operator in both draft and applied state.
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

      this.draftState.update(state => {
        const nextConditions = normalizeConditions(state.conditions);
        return nextConditions === state.conditions
          ? state
          : { ...state, conditions: nextConditions };
      });

      this.appliedState.update(state => {
        const nextConditions = normalizeConditions(state.conditions);
        return nextConditions === state.conditions
          ? state
          : { ...state, conditions: nextConditions };
      });
    });
  }

  protected setDraftMatchMode(value: unknown): void {
    if (value === 'all' || value === 'any') {
      this.draftState.update(state => ({ ...state, matchMode: value }));
    }
  }

  protected operatorRequiresValue(operator: NgnFilterOperatorId): boolean {
    const def = this.operatorDefs().find(d => d.id === operator);
    return def?.requiresValue ?? true;
  }

  protected setOperator(index: number, operator: NgnFilterOperatorId | null): void {
    if (!operator) {
      return;
    }
    const state = this.draftState();
    const next = state.conditions.slice();
    const existing = next[index];
    if (!existing) {
      return;
    }
    next[index] = {
      ...existing,
      operator,
      rawValue: this.operatorRequiresValue(operator) ? existing.rawValue : null,
    };
    this.draftState.set({ ...state, conditions: next });
  }

  protected setRawValue(index: number, rawValue: string | null): void {
    const state = this.draftState();
    const next = state.conditions.slice();
    const existing = next[index];
    if (!existing) {
      return;
    }
    next[index] = { ...existing, rawValue };
    this.draftState.set({ ...state, conditions: next });
  }

  protected addCondition(): void {
    if (!this.allowMultiple()) {
      return;
    }
    const firstOp = this.operatorDefs()[0]?.id ?? 'isEqual';
    this.draftState.update(state => ({
      ...state,
      conditions: [...state.conditions, this.createCondition(firstOp)],
    }));
  }

  protected removeCondition(index: number): void {
    if (!this.allowMultiple()) {
      return;
    }
    const current = this.draftState().conditions;
    if (current.length <= 1) {
      return;
    }
    const next = current.slice();
    next.splice(index, 1);
    this.draftState.update(state => ({ ...state, conditions: next }));
  }

  protected setListSelection(value: unknown): void {
    if (Array.isArray(value)) {
      this.draftState.update(state => ({ ...state, listSelection: value.map(v => String(v)) }));
      return;
    }
    if (value == null) {
      this.draftState.update(state => ({ ...state, listSelection: [] }));
      return;
    }
    this.draftState.update(state => ({ ...state, listSelection: [String(value)] }));
  }

  protected clear(): void {
    const firstOp = this.operatorDefs()[0]?.id ?? 'isEqual';
    this.draftState.set({
      matchMode: 'all',
      conditions: [this.createCondition(firstOp)],
      listSelection: [],
    });
    this.applyDraft({ close: true });
  }

  protected apply(): void {
    this.applyDraft();
  }

  private applyDraft(options?: { close?: boolean }): void {
    const draft = this.draftState();

    if (this.dataType() === 'list') {
      this.appliedState.update(state => ({
        ...state,
        listSelection: [...draft.listSelection],
        matchMode: 'all',
      }));
    } else {
      this.appliedState.update(state => ({
        ...state,
        matchMode: this.allowMultiple() ? draft.matchMode : 'all',
        conditions: draft.conditions.map(c => ({ ...c })),
      }));
    }

    const config = this.configValue();
    this.value.set(config);
    if (
      config.conditions.length === 0 ||
      (config.conditions.length === 1 &&
        this.operatorDefs().find(x => x.id === config.conditions[0].operator)?.requiresValue &&
        (config.conditions[0].rawValue === null || config.conditions[0].rawValue === ''))
    ) {
      this.filterChange.emit(null);
    } else {
      this.filterChange.emit(config);
    }

    if (this.filterLocally()) {
      this.filterResultChange.emit(this.filteredData());
    }

    const close = options?.close ?? true;
    if (close && this.mode() !== 'inline') {
      this.hide();
    }
  }

  private syncDraftFromApplied(): void {
    const applied = this.appliedState();
    this.draftState.set({
      matchMode: applied.matchMode,
      conditions: applied.conditions.map(c => ({ ...c })),
      listSelection: [...applied.listSelection],
    });
  }

  /** Shows the filter popup. Only works when {@link mode} is not `inline`. */
  public show(): void {
    if (this.mode() === 'inline') {
      throw new NgnError('filter', 'Cannot open an inline filter.');
    }
    if (this.mode() === 'headless' && !this.anchor()) {
      throw new NgnError('filter', 'Headless mode requires an [anchor] input.');
    }
    const popover = this._popover();
    if (!popover) {
      throw new NgnError('filter', 'Popover is not available.');
    }

    this.syncDraftFromApplied();
    popover.show();
  }

  /** Hides the filter popup. Only works when {@link mode} is not `inline`. */
  public hide(): void {
    if (this.mode() === 'inline') {
      throw new NgnError('filter', 'Cannot close an inline filter.');
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
