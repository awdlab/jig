import { computed, contentChild, Directive, input, TemplateRef } from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { ValueControlBase } from '@awdlab/jig/base';

import type { JigItem, JigItemsValue } from '@awdlab/jig/api';
import type { InputGeneric } from '@awdlab/jig/utils';

/**
 * This type determines the value type for the dropdown list.
 * * If `multiple` is `true`, the value is an array of item values.
 * * Else it is the item's value type.
 */
export type ValueType<Items extends readonly JigItem[], Multiple extends boolean> =
  InputGeneric<Multiple, false> extends true ? JigItemsValue<Items>[] : JigItemsValue<Items>;

@Directive()
export abstract class DropdownListTemplates<
  Items extends readonly JigItem[],
  Multiple extends boolean,
> extends ValueControlBase<'dropdownList', ValueType<Items, Multiple> | null> {
  // Item template
  private readonly _userItemTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('item');
  /**
   * Set a custom template for an item of the list.
   * Can also be set using an `<ng-template>` element with `#item` template reference variable.
   */
  public readonly templateItem = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly itemTemplate = computed(() => this._userItemTemplate() ?? this.templateItem());

  // Group template
  private readonly _userGroupTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('group');
  /**
   * Set a custom template for a group header in the list.
   * Can also be set using an `<ng-template>` element with `#group` template reference variable.
   */
  public readonly templateGroup = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly groupTemplate = computed(
    () => this._userGroupTemplate() ?? this.templateGroup()
  );

  // Empty template
  private readonly _userEmptyTemplate = contentChild<TemplateRef<unknown>>('empty');
  /**
   * Set a custom template shown when the list has no items.
   * Can also be set using an `<ng-template>` element with `#empty` template reference variable.
   */
  public readonly templateEmpty = input<TemplateRef<unknown> | null>(null);
  protected readonly emptyTemplate = computed(
    () => this._userEmptyTemplate() ?? this.templateEmpty()
  );

  /**
   * Types for the dropdown list templates.
   */
  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: Items[number] | undefined;
    };
  }>();
}
