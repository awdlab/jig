import { computed, contentChild, Directive, input, TemplateRef } from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { ValueControlBase } from '@awdlab/jig/base';

import type {
  JigFilterBuilderConfig,
  JigFilterBuilderTemplateContext,
} from '@awdlab/jig/filter-builder';

@Directive()
export abstract class FilterBarTemplates<T, TData> extends ValueControlBase<
  'filterBar',
  JigFilterBuilderConfig | null
> {
  private readonly _userFilterTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.filter>>('filter');
  /**
   * Replaces the filter popover's condition rows with your own editor. Forwarded
   * to the embedded `jig-filter-builder`, so the context is the builder's.
   * Can also be set using an `<ng-template>` element with a `#filter` template reference variable.
   */
  public readonly templateFilter = input<TemplateRef<typeof this.templateTypes.filter> | null>(
    null
  );
  protected readonly filterTemplate = computed(
    () => this._userFilterTemplate() ?? this.templateFilter()
  );

  /**
   * Types for the filter bar templates.
   */
  public readonly templateTypes = templateTypesFn<{
    filter: JigFilterBuilderTemplateContext<T, TData>;
  }>();
}
