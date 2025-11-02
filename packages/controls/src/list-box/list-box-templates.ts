import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { NgnItem } from '@ngneers/controls/api';
import { templateTypesFn, ValueControlBase } from '@ngneers/controls/api/ng';
import { InputGeneric } from '@ngneers/controls/utils';

/**
 * This type determines the value type for the select control.
 * * If `multiple` is `true`, the value is an array of items: `T[K][]`.
 * * Else it is the item's value type `T[K]`.
 */
export type ValueType<T, K extends keyof T, Multiple extends boolean> =
  InputGeneric<Multiple, false> extends true ? T[K][] : T[K];

@Directive()
export abstract class ListBoxTemplates<
  T,
  K extends keyof T,
  Multiple extends boolean,
> extends ValueControlBase<ValueType<T, K, Multiple> | null> {
  // Item template
  private readonly _defaultItemTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.item>>('defaultItemTemplate');
  private readonly _userItemTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('item');
  /**
   * Set a custom template for an item of the list box.
   * Can also be set using an `<ng-template>` element with `#item` template reference variable.
   */
  public readonly templateItem = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly itemTemplate = computed(
    () => this._userItemTemplate() ?? this.templateItem() ?? this._defaultItemTemplate()
  );
  // Group template
  private readonly _defaultGroupTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.item>>('defaultGroupTemplate');
  private readonly _userGroupTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('group');
  /**
   * Set a custom template for a group in the list box.
   * Can also be set using an `<ng-template>` element with `#group` template reference variable.
   */
  public readonly templateGroup = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly groupTemplate = computed(
    () => this._userGroupTemplate() ?? this.templateGroup() ?? this._defaultGroupTemplate()
  );

  // Empty template
  private readonly _defaultEmptyTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultEmptyTemplate');
  private readonly _userEmptyTemplate = contentChild<TemplateRef<unknown>>('empty');
  /**
   * Set a custom template for the empty state in the list box.
   * Can also be set using an `<ng-template>` element with `#empty` template reference variable.
   */
  public readonly templateEmpty = input<TemplateRef<unknown> | null>(null);
  protected readonly emptyTemplate = computed(
    () => this._userEmptyTemplate() ?? this.templateEmpty() ?? this._defaultEmptyTemplate()
  );

  /**
   * Types for the dialog templates.
   */
  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: NgnItem<T, K> | undefined;
    };
  }>();

  protected readonly templateTypesInternal = templateTypesFn<{
    item: {
      $implicit: NgnItem<T, K> | undefined;
      index: number;
    };
  }>();
}
