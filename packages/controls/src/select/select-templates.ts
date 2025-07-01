import { Component, computed, contentChild, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn, ValueControlBase } from '@ngneers/controls/api';

import { SelectOption } from './types';

@Component({
  imports: [],
  template: '',
})
export abstract class SelectTemplates<T, K extends keyof T> extends ValueControlBase<T[K]> {
  // Item template
  private readonly _defaultItemTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultItemTemplate');
  private readonly _userItemTemplate = contentChild<TemplateRef<unknown>>('item');
  public readonly templateItem = input<TemplateRef<unknown> | null>(null);
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
    viewChild.required<TemplateRef<unknown>>('defaultGroupTemplate');
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
      $implicit: SelectOption<T, K> | undefined;
    };
    group: {
      $implicit: SelectOption<T, K> | undefined;
    };
  }>();

  protected readonly templateTypesInternal = templateTypesFn<{
    options: {
      $implicit: SelectOption<T, K>[];
    };
  }>();
}
