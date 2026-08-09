import { computed, contentChild, Directive, input, TemplateRef } from '@angular/core';
import { ValueControlBase } from '@awdlab/jig/base';

/** Context for a custom {@link NgnRating} symbol template. */
export interface RatingIndicatorContext {
  /** Fill ratio for this symbol, 0..1. */
  $implicit: number;
  /** Zero-based symbol index. */
  index: number;
}

@Directive()
export abstract class RatingTemplates extends ValueControlBase<'rating', number | null> {
  private readonly _userIndicatorTemplate =
    contentChild<TemplateRef<RatingIndicatorContext>>('indicator');
  /**
   * Custom template for a single symbol. Receives the fill ratio (`$implicit`,
   * 0..1) and `index`. Can also be set with an `<ng-template #indicator>`.
   * When set, it replaces the default full/empty icon rendering per symbol.
   */
  public readonly indicatorTemplate = input<TemplateRef<RatingIndicatorContext> | null>(null);
  protected readonly resolvedIndicatorTemplate = computed(
    () => this._userIndicatorTemplate() ?? this.indicatorTemplate()
  );
}
