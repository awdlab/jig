import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  effect,
  input,
  signal,
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgnBase, provideSelf } from '@ngneers/controls/base';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  public readonly open = input(false, { transform: booleanAttribute });
  public readonly lazy = input(true, { transform: booleanAttribute });
  public readonly cache = input(false, { transform: booleanAttribute });
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
