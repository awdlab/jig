import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { NgnItem, templateTypesFn, ValueControlBase } from '@ngneers/controls/api';

// @internal
export type ValueType<T, K extends keyof T, Editable extends boolean> =
  // If Editable is true, the value can be a string, otherwise it must match the type of T[K].
  // When Editable is not specified, it has any type, so we need to handle that case.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any extends Editable ? T[K] : Editable extends true ? string : T[K];

@Directive()
export abstract class SelectTemplates<
  T,
  K extends keyof T,
  Editable extends boolean,
> extends ValueControlBase<ValueType<T, K, Editable> | null> {
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
  private readonly _defaultSelectedItemTemplate = viewChild.required<TemplateRef<unknown>>(
    'defaultSelectedItemTemplate'
  );
  private readonly _userSelectedItemTemplate = contentChild<TemplateRef<unknown>>('selectedItem');
  public readonly templateSelectedItem = input<TemplateRef<unknown> | null>(null);
  protected readonly selectedItemTemplate = computed(
    () =>
      this._userSelectedItemTemplate() ??
      this.templateSelectedItem() ??
      this._defaultSelectedItemTemplate()
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

  /**
   * Types for the dialog templates.
   */
  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: NgnItem<T, K> | undefined;
    };
  }>();
}
