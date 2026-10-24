import { computed, contentChild, Directive, input, TemplateRef } from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { ValueControlBase } from '@awdlab/jig/base';

import type { JigFilterConfig, JigFilterFieldTemplateContext } from './types';

@Directive()
export abstract class FilterFieldTemplates<T> extends ValueControlBase<
  'filterField',
  JigFilterConfig | null
> {
  private readonly _userFilterTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.filter>>('filter');
  /**
   * Replaces the condition rows with your own editor — a slider, a rating, anything
   * that can write a {@link JigFilterConfig} back through the context's `setValue`.
   * The trigger, the summary and the footer stay, so `autoApply` keeps working.
   * Can also be set using an `<ng-template>` element with a `#filter` template reference variable.
   */
  public readonly templateFilter = input<TemplateRef<typeof this.templateTypes.filter> | null>(
    null
  );
  protected readonly filterTemplate = computed(
    () => this._userFilterTemplate() ?? this.templateFilter()
  );

  /**
   * Types for the filter field templates.
   */
  public readonly templateTypes = templateTypesFn<{
    filter: JigFilterFieldTemplateContext<T>;
  }>();
}
