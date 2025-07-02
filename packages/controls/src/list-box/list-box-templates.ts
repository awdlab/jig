import { Component, computed, contentChild, input, TemplateRef } from '@angular/core';
import { NgnItem, templateTypesFn, ValueControlBase } from '@ngneers/controls/api';

@Component({
  imports: [],
  template: '',
})
export abstract class ListBoxTemplates<T, K extends keyof T> extends ValueControlBase<T[K]> {
  // Item template
  private readonly _defaultItemTemplate =
    contentChild.required<TemplateRef<unknown>>('defaultItemTemplate');
  private readonly _userItemTemplate = contentChild<TemplateRef<unknown>>('item');
  public readonly templateItem = input<TemplateRef<unknown> | null>(null);
  protected readonly itemTemplate = computed(
    () => this._userItemTemplate() ?? this.templateItem() ?? this._defaultItemTemplate()
  );
  // Group template
  private readonly _defaultGroupTemplate =
    contentChild.required<TemplateRef<unknown>>('defaultGroupTemplate');
  private readonly _userGroupTemplate = contentChild<TemplateRef<unknown>>('group');
  public readonly templateGroup = input<TemplateRef<unknown> | null>(null);
  protected readonly groupTemplate = computed(
    () => this._userGroupTemplate() ?? this.templateGroup() ?? this._defaultGroupTemplate()
  );

  /**
   * Types for the dialog templates.
   */
  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: NgnItem<T, K>;
    };
  }>();

  protected readonly templateTypesInternal = templateTypesFn<{
    item: {
      $implicit: NgnItem<T, K>;
      index: number;
    };
  }>();
}
