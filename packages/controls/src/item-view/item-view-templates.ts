import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@ngneers/controls/api/ng';
import { NgnBase } from '@ngneers/controls/base';
import { IconType } from '@ngneers/controls/custom-types';

@Directive()
export abstract class ItemViewTemplates<T> extends NgnBase<'item-view'> {
  /**
   * The template to be used for rendering each item in the item view.
   * Can also be set using the `item` content child.
   */
  public readonly templateItem = input<TemplateRef<typeof this.templateTypes.$input.item> | null>(
    null
  );
  private readonly _userItemTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('item');
  protected readonly itemTemplate = computed(() => this._userItemTemplate() ?? this.templateItem());

  // Separator template
  private readonly _defaultSeparatorTemplate = viewChild.required<
    TemplateRef<typeof this.templateTypes.separator>
  >('defaultSeparatorTemplate');
  private readonly _userSeparatorTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.separator>>('separator');
  /**
   * Set a custom template for the separators of the breadcrumb.
   * Can also be set using an `<ng-template>` element with `#separator` template reference variable.
   */
  public readonly templateSeparator = input<TemplateRef<
    typeof this.templateTypes.separator
  > | null>(null);
  protected readonly separatorTemplate = computed(
    () =>
      this._userSeparatorTemplate() ?? this.templateSeparator() ?? this._defaultSeparatorTemplate()
  );

  // Overflow item template
  private readonly _defaultOverflowItemTemplate = viewChild.required<
    TemplateRef<typeof this.templateTypes.overflow>
  >('defaultOverflowItemTemplate');
  private readonly _userOverflowItemTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.overflow>>('overflow');
  /**
   * Set a custom template for the overflow item.
   * Can also be set using an `<ng-template>` element with `#overflow` template reference variable.
   */
  public readonly templateOverflow = input<TemplateRef<typeof this.templateTypes.overflow> | null>(
    null
  );
  protected readonly overflowTemplate = computed(
    () =>
      this._userOverflowItemTemplate() ??
      this.templateOverflow() ??
      this._defaultOverflowItemTemplate()
  );

  /**
   * Template types for the item-view.
   * Can be used with the {@link NgnTemplate} directive for type safe ng-templates.
   */
  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: T;
      index: number;
      last: boolean;
      first: boolean;
    };
    separator: {
      $implicit: {
        icon?: IconType;
        character?: string;
      };
    };
    overflow: {
      $implicit: {
        totalCount: number;
        overflowCount: number;
        overflowItems: T[];
      };
    };
  }>();
}
