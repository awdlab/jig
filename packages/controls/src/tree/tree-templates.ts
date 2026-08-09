import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';

import { templateTypesFn } from '@awdlab/jig/api/ng';
import { ValueControlBase } from '@awdlab/jig/base';

import type { JigTreeItem, JigTreeItemsValue } from '@awdlab/jig/api';
import type { InputGeneric } from '@awdlab/jig/utils';

/**
 * Value type for the tree control.
 * * When `multiple` is `true`, the value is an array of node values.
 * * Otherwise it is a single node value.
 *
 * Uses {@link JigTreeItemsValue} (branch + leaf values) rather than the
 * leaf-only `JigItemsValue`, since a branch node can be selected too.
 */
export type ValueType<Items extends readonly JigTreeItem[], Multiple extends boolean> =
  InputGeneric<Multiple, false> extends true
    ? JigTreeItemsValue<Items>[]
    : JigTreeItemsValue<Items>;

@Directive()
export abstract class TreeTemplates<
  Items extends readonly JigTreeItem[],
  Multiple extends boolean,
> extends ValueControlBase<'tree', ValueType<Items, Multiple> | null> {
  // Item template
  private readonly _defaultItemTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.item>>('defaultItemTemplate');
  private readonly _userItemTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('item');
  /**
   * Set a custom template for a tree node.
   * Can also be set via an `<ng-template #item>` element. A per-node
   * `item.template` takes precedence over this global template.
   */
  public readonly templateItem = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly itemTemplate = computed(
    () => this._userItemTemplate() ?? this.templateItem() ?? this._defaultItemTemplate()
  );

  // Empty template
  private readonly _defaultEmptyTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultEmptyTemplate');
  private readonly _userEmptyTemplate = contentChild<TemplateRef<unknown>>('empty');
  /**
   * Set a custom template for the empty state.
   * Can also be set via an `<ng-template #empty>` element.
   */
  public readonly templateEmpty = input<TemplateRef<unknown> | null>(null);
  protected readonly emptyTemplate = computed(
    () => this._userEmptyTemplate() ?? this.templateEmpty() ?? this._defaultEmptyTemplate()
  );

  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: Items[number] | undefined;
      level: number;
      expanded: boolean;
      hasChildren: boolean;
    };
  }>();
}
