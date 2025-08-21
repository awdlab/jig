import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { NgnItem } from '@ngneers/controls/api';
import { templateTypesFn, ValueControlBase } from '@ngneers/controls/api/ng';
import { InputGeneric } from '@ngneers/controls/utils';

/**
 * This type determines the value type for the select control.
 * * If `multiple` is true, the value is an array of items: `T[K][]`.
 * * If `editable` is true, the value is a `string`.
 * * If neither is true, the value is the item's value type `T[K]`.
 */
export type ValueType<T, K extends keyof T, Editable extends boolean, Multiple extends boolean> =
  InputGeneric<Multiple, false> extends true
    ? T[K][]
    : InputGeneric<Editable, false> extends true
      ? string
      : T[K];

@Directive()
export abstract class SelectTemplates<
  T,
  K extends keyof T,
  Editable extends boolean,
  Multiple extends boolean,
> extends ValueControlBase<ValueType<T, K, Editable, Multiple> | null> {
  // Item template
  private readonly _defaultItemTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.item>>('defaultItemTemplate');
  private readonly _userItemTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('item');
  /**
   * Set a custom template for an item of the select control.
   * Can also be set using an `<ng-template>` element with `#item` template reference variable.
   */
  public readonly templateItem = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly itemTemplate = computed(
    () => this._userItemTemplate() ?? this.templateItem() ?? this._defaultItemTemplate()
  );

  // Selected item template
  private readonly _defaultSelectedItemTemplate = viewChild.required<
    TemplateRef<typeof this.templateTypes.item>
  >('defaultSelectedItemTemplate');
  private readonly _userSelectedItemTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('selectedItem');
  /**
   * Set a custom template for the selected item of the select control.
   * Can also be set using an `<ng-template>` element with `#selectedItem` template reference variable.
   */
  public readonly templateSelectedItem = input<TemplateRef<typeof this.templateTypes.item> | null>(
    null
  );
  protected readonly selectedItemTemplate = computed(
    () =>
      this._userSelectedItemTemplate() ??
      this.templateSelectedItem() ??
      this._defaultSelectedItemTemplate()
  );

  // Selected items template
  private readonly _defaultSelectedItemsTemplate = viewChild.required<
    TemplateRef<typeof this.templateTypes.selectedItems>
  >('defaultSelectedItemsTemplate');
  private readonly _userSelectedItemsTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.selectedItems>>('selectedItems');
  /**
   * Set a custom template for the selected items of the select control if {@link multiple} is `true`.
   * Can also be set using an `<ng-template>` element with `#selectedItems` template reference variable.
   */
  public readonly templateSelectedItems = input<TemplateRef<
    typeof this.templateTypes.selectedItems
  > | null>(null);
  protected readonly selectedItemsTemplate = computed(
    () =>
      this._userSelectedItemsTemplate() ??
      this.templateSelectedItems() ??
      this._defaultSelectedItemsTemplate()
  );

  // Group template
  private readonly _defaultGroupTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.item>>('defaultGroupTemplate');
  private readonly _userGroupTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('group');
  /**
   * Set a custom template for a group in the select control.
   * Can also be set using an `<ng-template>` element with `#group` template reference variable.
   */
  public readonly templateGroup = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly groupTemplate = computed(
    () => this._userGroupTemplate() ?? this.templateGroup() ?? this._defaultGroupTemplate()
  );

  // No items template
  private readonly _defaultNoItemsTemplate =
    viewChild.required<TemplateRef<null>>('defaultNoItemsTemplate');
  private readonly _userNoItemsTemplate = contentChild<TemplateRef<null>>('noItems');
  /**
   * Set a custom template for the no items state of the select control.
   * Can also be set using an `<ng-template>` element with `#noItems` template reference variable.
   */
  public readonly templateNoItems = input<TemplateRef<null> | null>(null);
  protected readonly noItemsTemplate = computed(
    () => this._userNoItemsTemplate() ?? this.templateNoItems() ?? this._defaultNoItemsTemplate()
  );

  /**
   * Types for the dialog templates.
   */
  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: NgnItem<T, K> | undefined;
    };
    selectedItems: {
      $implicit: NgnItem<T, K>[];
    };
  }>();
}
