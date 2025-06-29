import { Component, computed, contentChild, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn, ValueControlBase } from '@ngneers/controls/api';

@Component({
  imports: [],
  template: '',
})
export abstract class SelectTemplates<Option, Value> extends ValueControlBase<Value> {
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
    item: { $implicit: Option | undefined };
  }>();
}
