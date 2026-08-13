import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { JigBase } from '@awdlab/jig/base';

import type { LabelTemplateType } from './types';

@Directive()
export abstract class MeterTemplates extends JigBase<'meter'> {
  private readonly _defaultLabelTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.label>>('defaultLabelTemplate');
  private readonly _userLabelTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.label>>('label');
  /**
   * Set a custom template for a legend label.
   * Can also be set using an `<ng-template>` element with `#label` template reference variable.
   */
  public readonly templateLabel = input<TemplateRef<typeof this.templateTypes.label> | null>(null);
  protected readonly labelTemplate = computed(
    () => this._userLabelTemplate() ?? this.templateLabel() ?? this._defaultLabelTemplate()
  );

  /**
   * Types for the meter templates.
   */
  public readonly templateTypes = templateTypesFn<{
    /**
     * Type of the template variable for the legend label template.
     */
    label: LabelTemplateType;
  }>();
}
