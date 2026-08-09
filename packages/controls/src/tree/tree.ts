import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  type OnInit,
  output,
  runInInjectionContext,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { treeControlTemplate } from '@awdlab/jig-themes/templates/tree';

import {
  type FilterConfig,
  type FilterConfigInternal,
  filterOptions,
  type AwdTreeItem,
  type AwdTreeItemsValue,
} from '@awdlab/jig/api';
import { AwdStorage, type AwdStorageKind, AwdTemplate } from '@awdlab/jig/api/ng';
import { AwdPt, provideSelf } from '@awdlab/jig/base';
import { AwdButton } from '@awdlab/jig/button';
import { AwdCheckbox } from '@awdlab/jig/checkbox';
import { I18n } from '@awdlab/jig/i18n';
import { AwdScroller, AwdScrollerItem } from '@awdlab/jig/scroller';
import { createConditionalSpinner, AwdSpinner } from '@awdlab/jig/spinner';
import { Logger, maybeCallback } from '@awdlab/jig/utils';
import { asyncComputed } from '@awdlab/jig/utils-ng';

import { TreeTemplates, type ValueType } from './tree-templates';
import {
  applyLoadedChildren,
  cascadeCheck,
  collectBranchValues,
  computeNodeState,
  type FlatTreeNode,
  flattenTree,
} from './tree-utils';

/** The individual pieces of tree state that can be persisted. */
export type AwdTreeStorageState = 'value' | 'expanded';

/**
 * Configuration for persisting tree state (expansion + selection).
 * Pass to the `storage` input, e.g. `{ key: 'my-tree' }` or
 * `{ key: 'my-tree', kind: 'sessionstorage' }`.
 */
export interface AwdTreeStorageConfig {
  /** The storage key under which the state is saved. */
  key: string;
  /**
   * Where/how to persist. Accepts `'localstorage'`, `'sessionstorage'`, or a
   * custom `{ initialize, update }` adapter. Defaults to `'localstorage'`.
   */
  kind?: AwdStorageKind<Record<string, unknown>>;
  /**
   * Which states to persist. When omitted, all states are saved. When
   * provided, only the listed states are saved/restored.
   */
  states?: AwdTreeStorageState[];
}

/**
 * @category control
 */
@Component({
  selector: 'jig-tree',
  templateUrl: './tree.html',
  imports: [
    NgTemplateOutlet,
    AwdButton,
    AwdScroller,
    AwdScrollerItem,
    AwdCheckbox,
    AwdSpinner,
    AwdTemplate,
    AwdPt,
  ],
  providers: [provideSelf(AwdTree)],
  host: {
    '[attr.tabIndex]': 'focussable() ? 0 : null',
    '(keydown)': 'onKeyDown($event)',
    '(focusout)': 'currentHighlightedValue.set(null)',
    role: 'tree',
    '[attr.aria-activedescendant]':
      'currentHighlightedValue() != null ? inputId() + "_node_" + currentHighlightedValue() : null',
    '[attr.aria-multiselectable]': '!!multiple()',
    '[attr.aria-label]': 'label()',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[id]': 'inputId()',
  },
})
export class AwdTree<Items extends readonly AwdTreeItem[], Multiple extends boolean = false>
  extends TreeTemplates<Items, Multiple>
  implements OnInit
{
  protected readonly i18n = inject(I18n).translations;
  protected readonly theme = this.injectThemeTemplate(treeControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
    empty: () => !this.flatNodes().length,
  });

  private readonly _scroller = viewChild.required<AwdScroller<FlatTreeNode>>(AwdScroller);

  /** The tree items to render, as a nested list of {@link AwdTreeItem} objects. */
  public readonly items = input.required<Items>();

  /**
   * Whether nodes can be selected/checked.
   * @default true
   */
  public readonly selectable = input(true, { transform: booleanAttribute });
  /**
   * Whether the tree is focusable and participates in keyboard navigation.
   * @default true
   */
  public readonly focussable = input(true, { transform: booleanAttribute });
  /**
   * Whether the tree is virtualized. When enabled, provide {@link itemHeight}.
   * @default false
   */
  public readonly virtual = input(false, { transform: booleanAttribute });
  /**
   * When {@link virtual} is enabled, this defines the height of each node in the list.
   */
  public readonly itemHeight = input<number>();
  /**
   * Enable this to allow selecting multiple nodes. The value then becomes an array of node values.
   * @default false
   */
  public readonly multiple = input<Multiple>();
  /**
   * Whether to render checkboxes. Defaults to `multiple()`.
   * @default multiple()
   */
  public readonly checkbox = input<boolean>();
  /**
   * Boolean to enable filtering, or a `FilterConfig` to customize it.
   * @default false
   */
  public readonly filter = input<FilterConfig<Items[number]> | boolean>(false);
  /** Manually set the filter text. */
  public readonly filterText = input<string | null>(null);
  /** Values of expanded branch nodes (two-way). */
  public readonly expandedValues = model<AwdTreeItemsValue<Items>[]>([]);

  /**
   * Persist expansion + selection state across reloads. Provide a key and,
   * optionally, an `AwdStorageKind` (defaults to `'localstorage'`).
   */
  public readonly storage = input<AwdTreeStorageConfig | null>(null);
  private _storage?: AwdStorage<Record<string, unknown>>;

  /**
   * Loads the children of a `lazy` node the first time it is expanded.
   * The returned items are cached internally and merged into the tree.
   */
  public readonly loadChildren =
    input<(item: AwdTreeItem) => readonly AwdTreeItem[] | Promise<readonly AwdTreeItem[]>>();

  /** Emitted with the node's value whenever a node is clicked/selected. */
  public readonly itemClicked = output<AwdTreeItemsValue<Items>>();
  /** Emitted when a branch is expanded (fires before any lazy load resolves). */
  public readonly nodeExpand = output<AwdTreeItem>();

  protected readonly maybeCallback = maybeCallback;

  /** Lazily-loaded children, keyed by node value. */
  private readonly _loadedChildren = signal<
    ReadonlyMap<AwdTreeItemsValue<Items>, readonly AwdTreeItem[]>
  >(new Map());
  /** Node values currently awaiting their lazy children. */
  private readonly _loadingNodes = signal<ReadonlySet<AwdTreeItemsValue<Items>>>(new Set());

  protected readonly filteredItems = asyncComputed(async () => {
    const filter = !!this.filter();
    const appliedFilterOptions = this._appliedFilterOptions();
    const filterText = this.filterText();
    if (!filter || !filterText) {
      return this.items() as readonly AwdTreeItem[];
    }
    return await filterOptions(this.items(), filterText, appliedFilterOptions);
  }, []);

  private readonly _appliedFilterOptions = computed(() => {
    const filter = this.filter();
    const providedFilterArgs = typeof filter === 'boolean' ? {} : filter;
    const options: FilterConfigInternal<AwdTreeItem> = {
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

  /** While filtering, auto-expand every branch that survived the filter. */
  private readonly _autoExpanded = computed(() =>
    this.filterText() ? collectBranchValues(this.filteredItems()) : []
  );

  private readonly _expandedSet = computed(
    () => new Set<AwdTreeItemsValue<Items>>([...this.expandedValues(), ...this._autoExpanded()])
  );

  /** Filtered items with any lazily-loaded children merged in. */
  private readonly _effectiveItems = computed(() =>
    applyLoadedChildren(this.filteredItems(), this._loadedChildren())
  );

  public readonly flatNodes = computed(() =>
    flattenTree(this._effectiveItems(), this._expandedSet())
  );

  /** Keeps a rendered row bound to its node when the flat list shifts (expand/collapse/scroll). */
  protected readonly trackNode = (node: FlatTreeNode): unknown => node.item.value;

  protected readonly valueArray = computed(() => {
    const v = this.value();
    return (Array.isArray(v) ? v : v != null ? [v] : []) as AwdTreeItemsValue<Items>[];
  });
  private readonly _valueSet = computed(() => new Set(this.valueArray()));

  public readonly currentHighlightedValue = signal<AwdTreeItemsValue<Items> | null>(null);

  protected readonly showCheckboxes = computed(() => this.checkbox() ?? this.multiple() ?? false);

  constructor() {
    super();
    createConditionalSpinner(this.filterIsExecuting);

    // Fallback init for when the `storage` config arrives after ngOnInit (e.g.
    // an async binding). Idempotent with the ngOnInit path. Registered before
    // the persistence effect so the store is restored before any write; the
    // persistence effect no-ops until `_storage` exists anyway.
    effect(() => {
      const cfg = this.storage();
      if (cfg) {
        untracked(() => this._initStorage(cfg));
      }
    });

    // Persist expansion + selection whenever they change.
    effect(() => {
      const expanded = this.expandedValues();
      const value = this.value();
      untracked(() => {
        if (!this._storage) {
          return;
        }
        if (this._persistsState('expanded')) {
          this._storage.set('expanded', expanded);
        }
        if (this._persistsState('value')) {
          this._storage.set('value', value ?? null);
        }
      });
    });

    // Drop cached lazy children when the source items change identity.
    effect(() => {
      this.items();
      untracked(() => {
        if (this._loadedChildren().size || this._loadingNodes().size) {
          this._loadedChildren.set(new Map());
          this._loadingNodes.set(new Set());
        }
      });
    });

    effect(() => {
      const highlighted = this.currentHighlightedValue();
      if (highlighted == null) {
        return;
      }
      const index = this.flatNodes().findIndex(node => node.item.value === highlighted);
      if (index >= 0) {
        this._scroller().scrollToIndex(index);
      }
    });
  }

  /**
   * Create the store and restore persisted state before the first view check
   * (so it also feeds the SSR render for the `cookie` kind without triggering
   * ExpressionChangedAfterItHasBeenChecked).
   *
   * This is the common path: the `storage` config is normally bound before
   * init, so the restore happens pre-render. When the config only becomes
   * available after init (e.g. an async binding, or a dynamic host that applies
   * inputs after creating the component), the constructor effect below picks it
   * up instead — `_initStorage` is idempotent, so at most one of them runs.
   */
  public ngOnInit(): void {
    const cfg = this.storage();
    if (cfg) {
      this._initStorage(cfg);
    }
  }

  /** Create the store and restore persisted state. Runs at most once. */
  private _initStorage(cfg: AwdTreeStorageConfig): void {
    if (this._storage) {
      return;
    }
    // AwdStorage reads platform/document/request tokens, so it needs an
    // injection context.
    this._storage = runInInjectionContext(
      this.injector,
      () =>
        new AwdStorage<Record<string, unknown>>(cfg.key, cfg.kind ?? 'localstorage', {
          expanded: this.expandedValues(),
          value: this.value() ?? null,
        })
    );
    if (this._persistsState('expanded')) {
      const savedExpanded = this._storage.get('expanded');
      if (Array.isArray(savedExpanded)) {
        this.expandedValues.set(savedExpanded as AwdTreeItemsValue<Items>[]);
      }
    }
    if (this._persistsState('value')) {
      const savedValue = this._storage.get('value');
      if (savedValue !== undefined) {
        this.value.set(savedValue as ValueType<Items, Multiple>);
      }
    }
  }

  /** Whether the given state should be persisted (all states when unset). */
  private _persistsState(state: AwdTreeStorageState): boolean {
    const states = this.storage()?.states;
    return !states || states.includes(state);
  }

  /** Derived tri-state for a node's checkbox / aria-checked. */
  protected nodeState(item: AwdTreeItem): 'checked' | 'unchecked' | 'indeterminate' {
    return computeNodeState(item, this._valueSet());
  }

  /** Whether a node can be selected/checked right now. */
  protected isSelectable(node: FlatTreeNode): boolean {
    const disabled = node.parentDisabled || !!node.item.disabled;
    return this.selectable() && node.item.selectable !== false && !disabled;
  }

  /** Whether a lazy node is currently loading its children. */
  protected isLoading(item: AwdTreeItem): boolean {
    return this._loadingNodes().has(item.value as AwdTreeItemsValue<Items>);
  }

  protected async toggleExpand(item: AwdTreeItem): Promise<void> {
    const value = item.value as AwdTreeItemsValue<Items>;
    const willExpand = !this.expandedValues().includes(value);
    this.expandedValues.update(values =>
      values.includes(value) ? values.filter(v => v !== value) : [...values, value]
    );
    if (!willExpand) {
      return;
    }
    this.nodeExpand.emit(item);

    const loader = this.loadChildren();
    if (
      !item.lazy ||
      !loader ||
      this._loadedChildren().has(value) ||
      this._loadingNodes().has(value)
    ) {
      return;
    }
    this._loadingNodes.update(set => new Set(set).add(value));
    let children: readonly AwdTreeItem[] | undefined;
    try {
      children = await loader(item);
    } catch (error) {
      Logger.warn(`jig-tree: failed to load children for node "${String(value)}"`, error);
    }
    // Ignore stale results: if items() changed mid-load, the loading state was
    // cleared and this result should be dropped.
    if (children && this._loadingNodes().has(value)) {
      this._loadedChildren.update(map => new Map(map).set(value, children));
    }
    this._loadingNodes.update(set => {
      const next = new Set(set);
      next.delete(value);
      return next;
    });
  }

  protected onRowClick(node: FlatTreeNode): void {
    if (!this.isSelectable(node)) {
      return;
    }
    this.onSelect(node.item);
  }

  protected onSelect(item: AwdTreeItem): void {
    const value = item.value as AwdTreeItemsValue<Items>;
    if (this.multiple()) {
      if (this.showCheckboxes()) {
        // Cascade tri-state checking; value stays a leaf-only array.
        const shouldCheck = this.nodeState(item) !== 'checked';
        this.value.set(
          cascadeCheck(item, shouldCheck, this.valueArray()) as ValueType<Items, Multiple>
        );
      } else {
        const current = (this.value() as AwdTreeItemsValue<Items>[]) ?? [];
        this.value.set(
          (current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value]) as ValueType<Items, Multiple>
        );
      }
    } else {
      // Single-select always stores a single value (never an array), even when
      // checkboxes are shown.
      this.value.set(value as ValueType<Items, Multiple>);
    }
    this.itemClicked.emit(value);
    this.markTouched();
  }

  public scrollToIndex(index: number): void {
    this._scroller().scrollToIndex(index);
  }

  public onKeyDown(event: KeyboardEvent): void {
    const nodes = this.flatNodes();
    if (!nodes.length) {
      return;
    }
    const enabled = nodes.filter(n => !(n.parentDisabled || n.item.disabled));
    const key = event.key;

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      this._moveHighlight(enabled, key === 'ArrowDown' ? 1 : -1);
    } else if (key === 'Home' || key === 'End') {
      event.preventDefault();
      event.stopPropagation();
      const target = key === 'Home' ? enabled[0] : enabled[enabled.length - 1];
      this.currentHighlightedValue.set(
        (target?.item.value ?? null) as AwdTreeItemsValue<Items> | null
      );
    } else if (key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      this._expandOrEnter(nodes);
    } else if (key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      this._collapseOrLeave(nodes);
    } else if (key === 'Enter' || key === ' ') {
      const node = this._currentNode(nodes);
      if (node && this.isSelectable(node)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.onSelect(node.item);
      }
    } else if (key.length === 1 && /\S/.test(key)) {
      this._typeahead(enabled, key);
    }
  }

  private _currentNode(nodes: readonly FlatTreeNode[]): FlatTreeNode | undefined {
    const current = this.currentHighlightedValue();
    return nodes.find(n => n.item.value === current);
  }

  private _moveHighlight(enabled: readonly FlatTreeNode[], dir: 1 | -1): void {
    if (!enabled.length) {
      this.currentHighlightedValue.set(null);
      return;
    }
    const current = this.currentHighlightedValue();
    const idx = enabled.findIndex(n => n.item.value === current);
    let next: number;
    if (idx === -1) {
      next = dir === 1 ? 0 : enabled.length - 1;
    } else {
      next = (idx + dir + enabled.length) % enabled.length;
    }
    const target = enabled[next];
    if (target) {
      this.currentHighlightedValue.set(target.item.value as AwdTreeItemsValue<Items>);
    }
  }

  private _expandOrEnter(nodes: readonly FlatTreeNode[]): void {
    const node = this._currentNode(nodes);
    if (!node) {
      return;
    }
    if (node.hasChildren && !node.expanded) {
      void this.toggleExpand(node.item);
    } else if (node.hasChildren && node.expanded) {
      const idx = nodes.indexOf(node);
      for (let i = idx + 1; i < nodes.length; i++) {
        const candidate = nodes[i];
        if (!candidate || candidate.level <= node.level) {
          break; // left this node's subtree
        }
        if (!(candidate.parentDisabled || candidate.item.disabled)) {
          this.currentHighlightedValue.set(candidate.item.value as AwdTreeItemsValue<Items>);
          return;
        }
      }
    }
  }

  private _collapseOrLeave(nodes: readonly FlatTreeNode[]): void {
    const node = this._currentNode(nodes);
    if (!node) {
      return;
    }
    if (node.hasChildren && node.expanded) {
      void this.toggleExpand(node.item);
      return;
    }
    // move to parent: previous node with a smaller level
    const idx = nodes.indexOf(node);
    for (let i = idx - 1; i >= 0; i--) {
      const ancestor = nodes[i];
      if (!ancestor) {
        continue;
      }
      if (ancestor.level < node.level) {
        if (!(ancestor.parentDisabled || ancestor.item.disabled)) {
          this.currentHighlightedValue.set(ancestor.item.value as AwdTreeItemsValue<Items>);
        }
        return;
      }
    }
  }

  private _typeahead(enabled: readonly FlatTreeNode[], char: string): void {
    const lower = char.toLowerCase();
    const current = this.currentHighlightedValue();
    const start = enabled.findIndex(n => n.item.value === current);
    for (let offset = 1; offset <= enabled.length; offset++) {
      const node = enabled[(start + offset + enabled.length) % enabled.length];
      if (!node) {
        continue;
      }
      const label = maybeCallback(node.item.label).toLowerCase();
      if (label.startsWith(lower)) {
        this.currentHighlightedValue.set(node.item.value as AwdTreeItemsValue<Items>);
        return;
      }
    }
  }
}
