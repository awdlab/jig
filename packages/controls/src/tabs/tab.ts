import {
  afterRenderEffect,
  Component,
  contentChild,
  input,
  signal,
  TemplateRef,
} from '@angular/core';
import { JigBase, provideSelf } from '@awdlab/jig/base';

/**
 * @category control
 */
@Component({
  selector: 'jig-tab',
  imports: [],
  template: '',

  providers: [provideSelf(JigTab)],
})
export class JigTab extends JigBase<'tabs'> {
  protected readonly theme = null;
  /**
   * The unique identifier for the tab.
   */
  public readonly tabId = input.required<string>();

  /**
   * Useful for accessing the {@link tabId} in a safe way, without worrying about timing.
   */
  public readonly safeTabId = signal<string | null>(null);

  public readonly content = contentChild<TemplateRef<unknown>>('content');
  public readonly header = contentChild<TemplateRef<unknown>>('header');

  constructor() {
    super();

    afterRenderEffect(() => {
      this.safeTabId.set(this.tabId());
    });
  }
}
