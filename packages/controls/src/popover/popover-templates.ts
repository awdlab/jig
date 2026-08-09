import { contentChild, Directive, TemplateRef } from '@angular/core';
import { NgnBase } from '@awdlab/jig/base';

/**
 * Template projection for {@link NgnPopover}, extracted into a dedicated base class so the
 * component itself stays focused on positioning and open/close behavior.
 */
@Directive()
export abstract class PopoverTemplates extends NgnBase<'popover'> {
  /**
   * User-provided lazy content, projected via an `<ng-template #lazy>` inside the popover.
   * Rendered only once the popover first opens.
   */
  protected readonly lazyContent = contentChild<TemplateRef<unknown>>('lazy');
}
