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
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { treeControlTemplate } from '@awdlab/jig-themes/templates/tree';

import {
  type FilterConfigInternal,
  filterOptions,
  type JigTreeItem,
  type JigTreeItemsValue,
} from '@awdlab/jig/api';
import {
  inlineArrowStep,
  type JigStorageConfig,
  type JigStorageRegistration,
  JigTemplate,
  registerStorage,
} from '@awdlab/jig/api/ng';
import { JigPt, provideSelf } from '@awdlab/jig/base';
import { JigButton } from '@awdlab/jig/button';
import { JigCheckbox } from '@awdlab/jig/checkbox';
import { I18n } from '@awdlab/jig/i18n';
import { JigScroller, JigScrollerItem } from '@awdlab/jig/scroller';
import { createConditionalSpinner, JigSpinner } from '@awdlab/jig/spinner';
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
export type JigTreeStorageState = 'value' | 'expanded';

/**
 * Configuration for persisting tree state (expansion + selection).
 * Pass to the `storage` input, e.g. `{ key: 'my-tree' }` or
 * `{ key: 'my-tree', kind: 'sessionstorage' }`.
 */
export type JigTreeStorageConfig = JigStorageConfig<JigTreeStorageState>;

/**
 * @category control
 */
@Component({
  selector: 'jig-tree',
  templateUrl: './tree.html',
  imports: [
    NgTemplateOutlet,
    JigButton,
    JigScroller,
    JigScrollerItem,
    JigCheckbox,
    JigSpinner,
    JigTemplate,
    JigPt,
  ],
  providers: [provideSelf(JigTree)],
  host: {
    '[attr.tabindex]': 'focusable() ? 0 : null',
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
export class JigTree<Items extends readonly JigTreeItem[], Multiple extends boolean = false>
  extends TreeTemplates<Items, Multiple>
  implements OnInit
{
  protected readonly i18n = inject(I18n).translations;
  protected readonly theme = this.injectThemeTemplate(treeControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
    empty: () => !this.flatNodes().length,
  });

  private readonly _scroller = viewChild.required<JigScroller<FlatTreeNode>>(JigScroller);

  /**
   * Whether the tree is focusable and participates in keyboard navigation.
   * @default true
   */
  public readonly focusable = input(true, { transform: booleanAttribute });
  /** Values of expanded branch nodes (two-way). */
  public readonly expandedValues = model<JigTreeItemsValue<Items>[]>([]);

  /**
   * Persist expansion + selection state across reloads. Provide a key and,
   * optionally, a `jigStorageKind` (defaults to `'localstorage'`).
   */
  public readonly storage = input<JigTreeStorageConfig | null>(null);
  private readonly _storage: JigStorageRegistration;

  /**
   * Loads the children of a `lazy` node the first time it is expanded.
   * The returned items are cached internally and merged into the tree.
   */
  public readonly loadChildren =
    input<(item: JigTreeItem) => readonly JigTreeItem[] | Promise<readonly JigTreeItem[]>>();

  /** Emitted with the node's value whenever a node is clicked/selected. */
  public readonly itemClicked = output<JigTreeItemsValue<Items>>();
  /** Emitted when a branch is expanded (fires before any lazy load resolves). */
  public readonly nodeExpand = output<JigTreeItem>();

  protected readonly maybeCallback = maybeCallback;

  /** Lazily-loaded children, keyed by node value. */
  private readonly _loadedChildren = signal<
    ReadonlyMap<JigTreeItemsValue<Items>, readonly JigTreeItem[]>
  >(new Map());
  /** Node values currently awaiting their lazy children. */
  private readonly _loadingNodes = signal<ReadonlySet<JigTreeItemsValue<Items>>>(new Set());

  protected readonly filteredItems = asyncComputed(async () => {
    const filter = !!this.filter();
    const appliedFilterOptions = this._appliedFilterOptions();
    const filterText = this.filterText();
    if (!filter || !filterText) {
      return this.items() as readonly JigTreeItem[];
    }
    return await filterOptions(this.items(), filterText, appliedFilterOptions);
  }, []);

  private readonly _appliedFilterOptions = computed(() => {
    const filter = this.filter();
    const providedFilterArgs = typeof filter === 'boolean' ? {} : filter;
    const options: FilterConfigInternal<JigTreeItem> = {
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
    () => new Set<JigTreeItemsValue<Items>>([...this.expandedValues(), ...this._autoExpanded()])
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
    return (Array.isArray(v) ? v : v != null ? [v] : []) as JigTreeItemsValue<Items>[];
  });
  private readonly _valueSet = computed(() => new Set(this.valueArray()));

  public readonly currentHighlightedValue = signal<JigTreeItemsValue<Items> | null>(null);

  constructor() {
    super();
    createConditionalSpinner(this.filterIsExecuting);

    this._storage = registerStorage<JigTreeStorageState>({
      config: this.storage,
      slices: {
        expanded: {
          value: () => this.expandedValues(),
          restore: stored => {
            if (Array.isArray(stored)) {
              this.expandedValues.set(stored as JigTreeItemsValue<Items>[]);
            }
          },
        },
        value: {
          value: () => this.value() ?? null,
          restore: stored => this.value.set(stored as ValueType<Items, Multiple>),
        },
      },
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
   * Restore before the first view check, so the `cookie` kind also feeds the SSR
   * render without an ExpressionChangedAfterItHasBeenChecked. A config that only
   * arrives later (an async binding) is picked up by `registerStorage`'s own
   * effect instead; the two are idempotent against each other.
   */
  public ngOnInit(): void {
    this._storage.restore();
  }

  /** Derived tri-state for a node's checkbox / aria-checked. */
  protected nodeState(item: JigTreeItem): 'checked' | 'unchecked' | 'indeterminate' {
    return computeNodeState(item, this._valueSet());
  }

  /** Whether a node can be selected/checked right now. */
  protected isSelectable(node: FlatTreeNode): boolean {
    const disabled = node.parentDisabled || !!node.item.disabled;
    return this.selectable() && node.item.selectable !== false && !disabled;
  }

  /** Whether a lazy node is currently loading its children. */
  protected isLoading(item: JigTreeItem): boolean {
    return this._loadingNodes().has(item.value as JigTreeItemsValue<Items>);
  }

  protected async toggleExpand(item: JigTreeItem): Promise<void> {
    const value = item.value as JigTreeItemsValue<Items>;
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
    let children: readonly JigTreeItem[] | undefined;
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

  protected onSelect(item: JigTreeItem): void {
    const value = item.value as JigTreeItemsValue<Items>;
    if (this.multiple()) {
      if (this.showCheckboxes()) {
        // Cascade tri-state checking; value stays a leaf-only array.
        const shouldCheck = this.nodeState(item) !== 'checked';
        this.value.set(
          cascadeCheck(item, shouldCheck, this.valueArray()) as ValueType<Items, Multiple>
        );
      } else {
        const current = (this.value() as JigTreeItemsValue<Items>[]) ?? [];
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
        (target?.item.value ?? null) as JigTreeItemsValue<Items> | null
      );
    } else if (key === 'ArrowRight' || key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      // Depth runs along the inline axis: the key pointing away from the root expands.
      if (inlineArrowStep(event.currentTarget as Element, key) === 1) {
        this._expandOrEnter(nodes);
      } else {
        this._collapseOrLeave(nodes);
      }
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
      this.currentHighlightedValue.set(target.item.value as JigTreeItemsValue<Items>);
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
          this.currentHighlightedValue.set(candidate.item.value as JigTreeItemsValue<Items>);
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
          this.currentHighlightedValue.set(ancestor.item.value as JigTreeItemsValue<Items>);
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
        this.currentHighlightedValue.set(node.item.value as JigTreeItemsValue<Items>);
        return;
      }
    }
  }
}
