import {
  afterRenderEffect,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

import { Platform } from '../platform';

@Directive({
  selector: '[ngnDragScroll]',
})
export class NgnDragScroll {
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
  private _pointerDown = false;
  private _startX?: number = undefined;
  private _startY?: number = undefined;
  protected readonly isDragging = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    if (!inject(Platform).isBrowser) {
      return;
    }
    afterRenderEffect(() => {
      const pointerDown = fromEvent(this._el.nativeElement, 'pointerdown');
      const pointerMove = fromEvent(document, 'pointermove');
      const pointerUp = fromEvent(document, 'pointerup');

      pointerDown.pipe(takeUntilDestroyed(destroyRef)).subscribe(event => {
        this._pointerDown = true;
        this._startX = (event as PointerEvent).clientX;
        this._startY = (event as PointerEvent).clientY;
      });
      pointerUp.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => {
        this._pointerDown = false;
        this._startX = undefined;
        this._startY = undefined;
        this.isDragging.set(false);
      });

      pointerMove.pipe(takeUntilDestroyed(destroyRef)).subscribe(event => {
        if (!this._pointerDown) {
          return;
        }
        this.handleDrag(event);
      });
    });
  }

  private handleDrag(event: Event) {
    const { clientX, clientY } = event as PointerEvent;
    if (this._startX === undefined || this._startY === undefined) {
      throw new Error('Start positions are undefined');
    }
    const deltaX = clientX - this._startX;
    const deltaY = clientY - this._startY;
    if (!this.isDragging()) {
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      if (distance < 5) {
        return;
      }
      this.isDragging.set(true);
    }
    if (!this.isDragging()) {
      return;
    }
    this._startX = clientX;
    this._startY = clientY;
    this._el.nativeElement.scrollBy({
      left: -deltaX,
      top: -deltaY,
      behavior: 'auto',
    });
  }
}
