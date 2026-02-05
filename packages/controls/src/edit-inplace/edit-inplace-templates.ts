import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@ngneers/controls/api/ng';
import { ValueControlBase } from '@ngneers/controls/base';

import type { DisplayTemplateType, EditTemplateType } from './types';

@Directive()
export abstract class EditInplaceTemplates extends ValueControlBase<'editInplace', string> {
  // Display template
  private readonly _defaultDisplayTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.display>>('defaultDisplayTemplate');
  private readonly _userDisplayTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.display>>('display');
  /**
   * Set a custom template for the display.
   * Can also be set using an `<ng-template>` element with `#display` template reference variable.
   */
  public readonly templateDisplay = input<TemplateRef<typeof this.templateTypes.display> | null>(
    null
  );
  protected readonly displayTemplate = computed(
    () => this._userDisplayTemplate() ?? this.templateDisplay() ?? this._defaultDisplayTemplate()
  );

  // Edit template
  private readonly _defaultEditTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.edit>>('defaultEditTemplate');
  private readonly _userEditTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.edit>>('edit');
  /**
   * Set a custom template for the edit view.
   * Can also be set using an `<ng-template>` element with `#edit` template reference variable.
   */
  public readonly templateEdit = input<TemplateRef<typeof this.templateTypes.edit> | null>(null);
  protected readonly editTemplate = computed(
    () => this._userEditTemplate() ?? this.templateEdit() ?? this._defaultEditTemplate()
  );

  /**
   * Types for the drawer templates.
   */
  public readonly templateTypes = templateTypesFn<{
    /**
     * Type of the template variable for the display template.
     */
    display: DisplayTemplateType;
    /**
     * Type of the template variable for the edit template.
     */
    edit: EditTemplateType;
  }>();
}
