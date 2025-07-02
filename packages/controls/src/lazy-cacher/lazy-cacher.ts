import { NgTemplateOutlet } from '@angular/common';
import { Component, effect, input, signal, TemplateRef } from '@angular/core';

@Component({
  selector: 'ngn-lazy-cacher',
  templateUrl: './lazy-cacher.html',
  imports: [NgTemplateOutlet],
})
export class LazyCacher {
  public readonly lazyContent = input<TemplateRef<unknown> | undefined | null>(undefined);
  public readonly open = input<boolean>(false);
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
