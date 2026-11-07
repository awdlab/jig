import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, Component, effect, input, signal } from '@angular/core';
import { provideSelf } from '@awdlab/jig/base';

import { DeferTemplates } from './defer-templates';

/**
 * @category control
 */
@Component({
  selector: 'jig-defer',
  templateUrl: './defer.html',
  imports: [NgTemplateOutlet],
  providers: [provideSelf(JigDefer)],
  host: {
    '[class.open]': 'open()',
    '[class.hidden]': '!open() && hiddenOnClosed()',
    '[aria-hidden]': '!open()',
  },
  styles: [
    `
      :host.hidden {
        visibility: hidden;
        position: absolute;
        top: -9999px;
        left: -9999px;
      }
    `,
  ],
})
export class JigDefer<T> extends DeferTemplates<T> {
  protected readonly theme = null;
  /**
   * Whether the deferred content is currently open (shown).
   * @default false
   */
  public readonly open = input(false, { transform: booleanAttribute });
  /**
   * Whether to defer rendering until first opened. When `false`, the content is
   * rendered immediately regardless of {@link open}.
   * @default true
   */
  public readonly lazy = input(true, { transform: booleanAttribute });
  /**
   * Whether to keep the content rendered after it has been opened once, rather
   * than tearing it down when {@link open} becomes `false`.
   * @default false
   */
  public readonly cache = input(false, { transform: booleanAttribute });
  /**
   * Whether the host is visually hidden (but kept in the DOM) while closed.
   * @default true
   */
  public readonly hiddenOnClosed = input(true, { transform: booleanAttribute });

  protected readonly hasBeenOpened = signal(false);

  constructor() {
    super();
    effect(() => {
      if (this.open()) {
        this.hasBeenOpened.set(true);
      }
    });
  }
}
