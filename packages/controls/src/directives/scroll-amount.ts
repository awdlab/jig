import { afterRenderEffect, Directive, ElementRef, inject, signal } from '@angular/core';
import { domEventObservable } from '@ngneers/controls/api/ng';
import { map } from 'rxjs';

@Directive({
  selector: '[ngnScrollAmount]',
})
export class NgnScrollAmount {
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
  public readonly scrollTop = signal(this._el.nativeElement.scrollTop);
  public readonly scrollLeft = signal(this._el.nativeElement.scrollLeft);
  private readonly _scrollEvent = domEventObservable(this._el.nativeElement, 'scroll');

  constructor() {
    afterRenderEffect(() => {
      const obs = this._scrollEvent.pipe(
        map(e => {
          const target = e.target as HTMLElement;
          return {
            top: target.scrollTop,
            left: target.scrollLeft,
          };
        })
      );
      obs.subscribe(scroll => {
        this.scrollTop.set(scroll.top);
        this.scrollLeft.set(scroll.left);
      });
    });
  }
}
