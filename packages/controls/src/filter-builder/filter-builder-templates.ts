import { computed, contentChild, Directive, input, TemplateRef } from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { ValueControlBase } from '@awdlab/jig/base';

import type { JigFilterBuilderConfig, JigFilterProperty } from './types';

@Directive()
export abstract class FilterBuilderTemplates<T, TData> extends ValueControlBase<
  'filterBuilder',
  JigFilterBuilderConfig | null
> {
  private readonly _userFilterTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.filter>>('filter');
  /**
   * Replaces the condition rows with your own editor — a slider, a rating, anything
   * that can write a {@link JigFilterBuilderConfig} back through the context's `setValue`.
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
   * Types for the filter builder templates.
   */
  public readonly templateTypes = templateTypesFn<{
    filter: {
      /** The configuration being edited, `null` while nothing is set. */
      $implicit: JigFilterBuilderConfig | null;
      /** The data being filtered, for deriving options from. */
      data: readonly T[];
      /** The properties a condition may name. */
      properties: readonly JigFilterProperty<T, TData>[];
      disabled: boolean;
      readonly: boolean;
      /** Writes a configuration back, honouring `autoApply` and its debounce. */
      setValue: (config: JigFilterBuilderConfig | null) => void;
      /** Commits the pending configuration. Only meaningful while `autoApply` is off. */
      apply: () => void;
      /** Restores the configuration as it was when the popover opened. */
      cancel: () => void;
      /** Clears the configuration. */
      clear: () => void;
      /** Closes the popover. */
      close: () => void;
    };
  }>();
}
