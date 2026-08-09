import {
  type AfterViewInit,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { getNearestJigInstance } from '@awdlab/jig/base';
import { JigError, toggleClass } from '@awdlab/jig/utils';

import { JigScroller } from './scroller';

/**
 * Binds a rendered element to the item it represents inside an enclosing
 * {@link JigScroller}, so the scroller can apply its per-item classes and
 * resolve the item's sticky state.
 *
 * Throws if used outside an `JigScroller`.
 *
 * @category directive
 */
@Directive({ selector: '[ngnScrollerItem]' })
export class JigScrollerItem implements AfterViewInit {
  private readonly _el = inject(ElementRef<HTMLElement>);
  /**
   * The item bound to this element. Used to resolve its sticky state and apply
   * the scroller's item classes from the enclosing {@link JigScroller}.
   */
  public readonly ngnScrollerItem = input.required<object>();
  private readonly _scroller = signal<JigScroller<unknown> | null>(null);

  public ngAfterViewInit() {
    if (!this._el.nativeElement.isConnected) {
      return;
    }
    const parentInstance = getNearestJigInstance(this._el.nativeElement, JigScroller);
    if (!parentInstance) {
      throw new JigError(
        'scroller',
        'ngnScrollerItem must be used within an JigScroller component'
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
