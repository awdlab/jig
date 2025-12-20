import { AfterViewInit, Directive, effect, ElementRef, inject, input, signal } from '@angular/core';
import { getNearestNgnInstance } from '@ngneers/controls/base';
import { NgnError } from '@ngneers/controls/utils';

import { NgnScroller } from './scroller';

@Directive({ selector: '[ngnScrollerItem]' })
export class NgnScrollerItem implements AfterViewInit {
  private readonly _el = inject(ElementRef<HTMLElement>);
  public readonly ngnScrollerItem = input.required<object>();
  private readonly _scroller = signal<NgnScroller<unknown> | null>(null);

  public ngAfterViewInit() {
    if (!this._el.nativeElement.isConnected) {
      return;
    }
    const parentInstance = getNearestNgnInstance(this._el.nativeElement);
    if (!(parentInstance instanceof NgnScroller)) {
      throw new NgnError(
        'scroller',
        'ngnScrollerItem must be used within an NgnScroller component'
      );
    }
    this._scroller.set(parentInstance);
  }

  constructor() {
    effect(() => {
      const item = this.ngnScrollerItem();
      const scroller = this._scroller();
      if (!item || !scroller) {
        return;
      }
      const stickyField = scroller.fieldSticky() as unknown as string | null;
      const isSticky = !!stickyField && !!(item as any)[stickyField];

      this._el.nativeElement.classList.toggle(scroller['theme'].class('item-sticky'), isSticky);
      this._el.nativeElement.classList.toggle(scroller['theme'].class('item'), true);
    });
  }
}
