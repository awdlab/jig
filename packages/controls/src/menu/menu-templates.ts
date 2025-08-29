import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@ngneers/controls/api/ng';

import { MenuItem } from './types';

@Directive()
export abstract class MenuTemplates {
  // Item template
  private readonly _defaultItemTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultItemTemplate');
  private readonly _userItemTemplate = contentChild<TemplateRef<unknown>>('item');
  /**
   * Set a custom template for an item of the menu.
   * Can also be set using an `<ng-template>` element with `#item` template reference variable.
   */
  public readonly templateItem = input<TemplateRef<unknown> | null>(null);
  protected readonly itemTemplate = computed(
    () => this._userItemTemplate() ?? this.templateItem() ?? this._defaultItemTemplate()
  );

  // Group template
  private readonly _defaultGroupTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultGroupTemplate');
  private readonly _userGroupTemplate = contentChild<TemplateRef<unknown>>('group');
  /**
   * Set a custom template for a group of items in the menu.
   * Can also be set using an `<ng-template>` element with `#group` template reference variable.
   */
  public readonly templateGroup = input<TemplateRef<unknown> | null>(null);
  protected readonly groupTemplate = computed(
    () => this._userGroupTemplate() ?? this.templateGroup() ?? this._defaultGroupTemplate()
  );

  /**
   * Types for the dialog templates.
   */
  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: {
        item: MenuItem;
      };
    };
  }>();
}
