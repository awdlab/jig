import { contentChild, Directive, input, TemplateRef } from '@angular/core';
import { JigBase } from '@awdlab/jig/base';

@Directive()
export abstract class HintTemplates extends JigBase<'hint'> {
  /**
   * The hint text. Can also be a `TemplateRef` for custom rendering, or set via
   * an `<ng-template #content>` content child. Projected content (`<ng-content>`)
   * is used as a fallback when neither is provided.
   * @default null
   */
  public readonly content = input<TemplateRef<unknown> | string | null>(null);
  protected readonly userContentTemplate = contentChild<TemplateRef<unknown>>('content');
}
