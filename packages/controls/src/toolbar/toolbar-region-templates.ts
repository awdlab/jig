import { contentChildren, Directive, TemplateRef } from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { JigBase } from '@awdlab/jig/base';

@Directive()
export abstract class ToolbarRegionTemplates extends JigBase<'toolbarRegion'> {
  /**
   * Template types for the toolbar region.
   * Can be used with the {@link JigTemplate} directive for type safe ng-templates.
   */
  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: {
        /** `true` while rendering inside the overflow popover. */
        overflowed: boolean;
      };
    };
  }>();

  /** One `<ng-template #item>` per collapsible item, in DOM order. */
  public readonly itemTemplates = contentChildren('item', { read: TemplateRef });
}
