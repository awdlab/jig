import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { JigBase } from '@awdlab/jig/base';

import type { ToolbarPlacement } from './types';
import type { IconType } from '@awdlab/jig-custom-types';

@Directive()
export abstract class ToolbarTemplates extends JigBase<'toolbar'> {
  // Overflow trigger template
  private readonly _defaultOverflowTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.overflow>>('defaultOverflowTemplate');
  private readonly _userOverflowTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.overflow>>('overflow');
  /**
   * Set a custom template for the `…` trigger that reveals the collapsed items.
   * Can also be set using an `<ng-template>` element with `#overflow` template reference variable.
   */
  public readonly templateOverflow = input<TemplateRef<typeof this.templateTypes.overflow> | null>(
    null
  );
  protected readonly overflowTemplate = computed(
    () => this._userOverflowTemplate() ?? this.templateOverflow() ?? this._defaultOverflowTemplate()
  );

  // Popover content template
  private readonly _defaultPopoverContentTemplate = viewChild.required<
    TemplateRef<typeof this.templateTypes.popoverContent>
  >('defaultPopoverContentTemplate');
  private readonly _userPopoverContentTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.popoverContent>>('popoverContent');
  /**
   * Set a custom template for the contents of the overflow popover.
   * Can also be set using an `<ng-template>` element with `#popoverContent` template reference variable.
   */
  public readonly templatePopoverContent = input<TemplateRef<
    typeof this.templateTypes.popoverContent
  > | null>(null);
  protected readonly popoverContentTemplate = computed(
    () =>
      this._userPopoverContentTemplate() ??
      this.templatePopoverContent() ??
      this._defaultPopoverContentTemplate()
  );

  /**
   * Template types for the toolbar.
   * Can be used with the {@link JigTemplate} directive for type safe ng-templates.
   */
  public readonly templateTypes = templateTypesFn<{
    overflow: {
      $implicit: {
        icon?: IconType;
        placement: ToolbarPlacement;
        overflowCount: number;
        /** Whether this placement's popover is currently open. */
        open: boolean;
        /** Opens or closes this placement's popover. */
        toggle: () => void;
      };
    };
    popoverContent: {
      $implicit: {
        placement: ToolbarPlacement;
        /** The collapsed items, in DOM order. Render each with `ngTemplateOutlet`. */
        itemTemplates: readonly TemplateRef<{ $implicit: { overflowed: boolean } }>[];
      };
    };
  }>();
}
