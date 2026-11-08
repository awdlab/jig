import { Directive, input, TemplateRef } from '@angular/core';
import { JigBase } from '@awdlab/jig/base';

@Directive()
export abstract class DeferTemplates<T> extends JigBase<null> {
  /**
   * Template to render lazily. When omitted, the projected content
   * (`ng-content`) is rendered instead.
   */
  public readonly lazyContent = input<TemplateRef<T> | undefined | null>(undefined);
  /**
   * Context object passed to {@link lazyContent} when it is rendered.
   * @default null
   */
  public readonly lazyContentContext = input<T | null>(null);
}
