import { computed, contentChild, Directive, input, TemplateRef } from '@angular/core';
import { ValueControlBase } from '@awdlab/jig/base';

import type { JigItem, JigItemsValue } from '@awdlab/jig/api';
import type { InputGeneric } from '@awdlab/jig/utils';

/**
 * This type determines the value type for the filter list box.
 * * If `multiple` is `true`, the value is an array of item values.
 * * Else it is the item's value type.
 */
export type ValueType<Items extends readonly JigItem[], Multiple extends boolean> =
  InputGeneric<Multiple, false> extends true ? JigItemsValue<Items>[] : JigItemsValue<Items>;

@Directive()
export abstract class FilterListBoxTemplates<
  Items extends readonly JigItem[],
  Multiple extends boolean,
> extends ValueControlBase<'filterListBox', ValueType<Items, Multiple> | null> {
  private readonly _userEmptyTemplate = contentChild<TemplateRef<unknown>>('empty');
  /**
   * Set a custom template shown when the list has no items. It replaces the
   * built-in empty state, including its "clear all filters" action.
   * Can also be set using an `<ng-template>` element with `#empty` template reference variable.
   */
  public readonly templateEmpty = input<TemplateRef<unknown> | null>(null);
  protected readonly emptyTemplate = computed(
    () => this._userEmptyTemplate() ?? this.templateEmpty()
  );
}
