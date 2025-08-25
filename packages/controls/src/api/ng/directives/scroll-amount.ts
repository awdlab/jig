import {
  afterRenderEffect,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, map } from 'rxjs';

@Directive({
  selector: '[ngnScrollAmount]',
})
export class NgnScrollAmount {
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
  public readonly scrollTop = signal(this._el.nativeElement.scrollTop);
  public readonly scrollLeft = signal(this._el.nativeElement.scrollLeft);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterRenderEffect(() => {
      const obs = fromEvent(this._el.nativeElement, 'scroll').pipe(
        map(e => {
          const target = e.target as HTMLElement;
          return {
            top: target.scrollTop,
            left: target.scrollLeft,
          };
        })
      );
      obs.pipe(takeUntilDestroyed(destroyRef)).subscribe(scroll => {
        this.scrollTop.set(scroll.top);
        this.scrollLeft.set(scroll.left);
      });
    });
  }
}
