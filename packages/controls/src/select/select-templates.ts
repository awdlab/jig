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

  /**
   * Types for the dialog templates.
   */
  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: {
        data: T;
        value: T[K];
        label: string;
        testId?: string | number;
      };
    };
    group: {
      $implicit: {
        data: T;
        label: string;
        testId?: string | number;
      };
    };
  }>();

  protected readonly templateTypesInternal = templateTypesFn<{
    options: {
      $implicit: SelectOption<T, K>[];
    };
  }>();
}
