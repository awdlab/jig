import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { NgnItem, templateTypesFn, ValueControlBase } from '@ngneers/controls/api';

@Directive()
export abstract class ListBoxTemplates<T, K extends keyof T> extends ValueControlBase<T[K] | null> {
  // Item template
  private readonly _defaultItemTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.item>>('defaultItemTemplate');
  private readonly _userItemTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('item');
  public readonly templateItem = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly itemTemplate = computed(
    () => this._userItemTemplate() ?? this.templateItem() ?? this._defaultItemTemplate()
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

  protected readonly templateTypesInternal = templateTypesFn<{
    item: {
      $implicit: NgnItem<T, K> | undefined;
      index: number;
    };
  }>();
}
