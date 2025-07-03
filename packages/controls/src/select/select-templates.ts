import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { NgnItem, templateTypesFn, ValueControlBase } from '@ngneers/controls/api';

@Directive()
export abstract class SelectTemplates<T, K extends keyof T> extends ValueControlBase<T[K]> {
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
