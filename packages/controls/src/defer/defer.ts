import { NgTemplateOutlet } from '@angular/common';
import { Component, effect, input, signal, TemplateRef } from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';

/**
 * @category control
 */
@Component({
  selector: 'ngn-defer',
  templateUrl: './defer.html',
  imports: [NgTemplateOutlet],
  providers: [provideSelf(NgnDefer)],
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
export class NgnDefer<T> extends NgnBase<null> {
  public readonly lazyContent = input<TemplateRef<T> | undefined | null>(undefined);
  public readonly lazyContentContext = input<T | null>(null);
  public readonly open = input<boolean>(false);
  public readonly lazy = input<boolean>(true);
  public readonly cache = input<boolean>(false);
  public readonly hiddenOnClosed = input<boolean>(true);

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
