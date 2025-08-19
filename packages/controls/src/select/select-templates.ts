import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { NgnItem } from '@ngneers/controls/api';
import { templateTypesFn, ValueControlBase } from '@ngneers/controls/api/ng';

// @internal
export type ValueTypeEditable<
  T,
  K extends keyof T,
  Editable extends boolean,
> = Editable extends true ? string : T[K];
// @internal
export type ValueType<
  T,
  K extends keyof T,
  Editable extends boolean,
  Multiple extends boolean,
> = Multiple extends true ? ValueTypeEditable<T, K, Editable>[] : ValueTypeEditable<T, K, Editable>;

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
  public readonly templateGroup = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly groupTemplate = computed(
    () => this._userGroupTemplate() ?? this.templateGroup() ?? this._defaultGroupTemplate()
  );

  // No items template
  private readonly _defaultNoItemsTemplate =
    viewChild.required<TemplateRef<null>>('defaultNoItemsTemplate');
  private readonly _userNoItemsTemplate = contentChild<TemplateRef<null>>('noItems');
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
