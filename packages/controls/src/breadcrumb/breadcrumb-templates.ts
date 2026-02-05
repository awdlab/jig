import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@ngneers/controls/api/ng';
import { NgnBase } from '@ngneers/controls/base';

import type { ItemTemplateType, OverflowTemplateType, SeparatorTemplateType } from './types';

@Directive()
export abstract class BreadcrumbTemplates extends NgnBase<'breadcrumb'> {
  // Item template
  private readonly _defaultItemTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.item>>('defaultItemTemplate');
  private readonly _userItemTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('item');
  /**
   * Set a custom template for an item.
   * Can also be set using an `<ng-template>` element with `#item` template reference variable.
   */
  public readonly templateItem = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly itemTemplate = computed(
    () => this._userItemTemplate() ?? this.templateItem() ?? this._defaultItemTemplate()
  );

  // Separator template
  private readonly _defaultSeparatorTemplate = viewChild.required<
    TemplateRef<typeof this.templateTypes.separator>
  >('defaultSeparatorTemplate');
  private readonly _userSeparatorTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.separator>>('separator');
  /**
   * Set a custom template for a separator.
   * Can also be set using an `<ng-template>` element with `#separator` template reference variable.
   */
  public readonly templateSeparator = input<TemplateRef<
    typeof this.templateTypes.separator
  > | null>(null);
  protected readonly separatorTemplate = computed(
    () =>
      this._userSeparatorTemplate() ?? this.templateSeparator() ?? this._defaultSeparatorTemplate()
  );

  // Overflow template
  private readonly _defaultOverflowTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.overflow>>('defaultOverflowTemplate');
  private readonly _userOverflowTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.overflow>>('overflow');
  /**
   * Set a custom template for the overflowing items.
   * Can also be set using an `<ng-template>` element with `#overflow` template reference variable.
   */
  public readonly templateOverflow = input<TemplateRef<typeof this.templateTypes.overflow> | null>(
    null
  );
  protected readonly overflowTemplate = computed(
    () => this._userOverflowTemplate() ?? this.templateOverflow() ?? this._defaultOverflowTemplate()
  );

  /**
   * Types for the breadcrumb templates.
   */
  public readonly templateTypes = templateTypesFn<{
    /**
     * Type of the template variable for the item template.
     */
    item: ItemTemplateType;
    separator: SeparatorTemplateType;
    overflow: OverflowTemplateType;
  }>();
}
