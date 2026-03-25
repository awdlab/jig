import {
  type AfterViewInit,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { getNearestNgnInstance } from '@ngneers/controls/base';
import { NgnError, toggleClass } from '@ngneers/controls/utils';

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
    const parentInstance = getNearestNgnInstance(this._el.nativeElement, NgnScroller);
    if (!parentInstance) {
      throw new NgnError(
        'scroller',
        'ngnScrollerItem must be used within an NgnScroller component'
      );
    }
    this._scroller.set(parentInstance);
  }

  constructor() {
    let prevItemClass = '';
    let prevStickyClass = '';
    effect(() => {
      const item = this.ngnScrollerItem() as Record<string, unknown> | null;
      const scroller = this._scroller();
      if (!item || !scroller) {
        return;
      }
      const stickyField = scroller.fieldSticky() as unknown as string | null;
      const isSticky = !!stickyField && stickyField in item ? !!item[stickyField] : false;

      const stickyClass = scroller['theme'].class('item-sticky');
      if (prevStickyClass && prevStickyClass !== stickyClass) {
        toggleClass(this._el.nativeElement, prevStickyClass, false);
      }
      toggleClass(this._el.nativeElement, stickyClass, isSticky);
      prevStickyClass = stickyClass;

      const itemClass = scroller['theme'].class('item');
      if (prevItemClass && prevItemClass !== itemClass) {
        toggleClass(this._el.nativeElement, prevItemClass, false);
      }
      toggleClass(this._el.nativeElement, itemClass, true);
      prevItemClass = itemClass;
    });
  }
}
