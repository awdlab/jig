import { NgTemplateOutlet } from '@angular/common';
import { Component, effect, input, signal, TemplateRef } from '@angular/core';

/**
 * @category control
 */
@Component({
  selector: 'ngn-defer',
  templateUrl: './defer.html',
  imports: [NgTemplateOutlet],
  host: {
    '[class.open]': 'open()',
  },
  styles: [
    `
      :host:not(.open) {
        visibility: hidden;
        position: absolute;
        top: -9999px;
        left: -9999px;
      }
    `,
  ],
})
export class NgnDefer {
  public readonly lazyContent = input<TemplateRef<unknown> | undefined | null>(undefined);
  public readonly open = input<boolean>(false);
  public readonly lazy = input<boolean>(true);
  public readonly cache = input<boolean>(false);

  protected readonly hasBeenOpened = signal(false);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.hasBeenOpened.set(true);
      }
    });
  }
}
