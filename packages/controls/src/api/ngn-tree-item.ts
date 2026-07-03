import type { NgnItem } from './ngn-item';
import type { TemplateRef } from '@angular/core';

/**
 * Item model for the tree control. Extends {@link NgnItem} and reuses its
 * `items` field for child nodes. A node with a non-empty `items` array is a
 * branch; otherwise it is a leaf.
 */
export interface NgnTreeItem<T = any, V = any> extends NgnItem<T, V> {
  /** Child nodes. */
  items?: NgnTreeItem<T, V>[];
  /**
   * Whether this node participates in selection/checking. Default `true`.
   * When `false`: no checkbox is rendered, the node is excluded from `value`,
   * but a branch remains expandable and its children stay independently
   * selectable.
   */
  selectable?: boolean;
  /**
   * Marks a branch whose children are loaded on demand. A lazy node renders as
   * expandable before its children exist; on first expand the tree invokes the
   * `loadChildren` callback (and emits `nodeExpand`).
   */
  lazy?: boolean;
  /**
   * Per-node template override. Takes precedence over the global item template.
   */
  template?: TemplateRef<{ $implicit: NgnTreeItem<T, V> }>;
}

/**
 * The value of a single tree node, including branch values.
 *
 * Unlike {@link NgnItemValue} (which yields leaf values only), this unions a
 * branch node's own `value` with the values of all its descendants — because
 * in a tree a branch node can itself be selected/expanded.
 */
export type NgnTreeItemValue<Item extends NgnTreeItem> = Item extends {
  items: readonly (infer A)[];
}
  ? A extends NgnTreeItem
    ? Item['value'] | NgnTreeItemValue<A>
    : Item['value']
  : Item['value'];

/**
 * The union of every node value (branches and leaves) in a tree item list.
 * This is the type-safe value space for selection, expansion, and highlight.
 */
export type NgnTreeItemsValue<Items extends readonly NgnTreeItem[]> = Items[number] extends infer A
  ? A extends NgnTreeItem
    ? NgnTreeItemValue<A>
    : never
  : never;
