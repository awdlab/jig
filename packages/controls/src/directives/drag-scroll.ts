import { afterRenderEffect, Directive, DOCUMENT, ElementRef, inject, signal } from '@angular/core';
import { domEventObservable, Platform } from '@ngneers/controls/api/ng';

@Directive({
  selector: '[ngnDragScroll]',
})
export class NgnDragScroll {
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
  private _pointerDown = false;
  private _startX?: number = undefined;
  private _startY?: number = undefined;
  protected readonly isDragging = signal(false);

  private readonly _document = inject(DOCUMENT);

  private readonly _pointerDownEvent = domEventObservable(this._el.nativeElement, 'pointerdown');
  private readonly _pointerMoveEvent = domEventObservable(this._document, 'pointermove');
  private readonly _pointerUpEvent = domEventObservable(this._document, 'pointerup');

  constructor() {
    if (!inject(Platform).isBrowser) {
      return;
    }
    afterRenderEffect(() => {
      this._pointerDownEvent.subscribe(event => {
        this._pointerDown = true;
        this._startX = (event as PointerEvent).clientX;
        this._startY = (event as PointerEvent).clientY;
      });
      this._pointerUpEvent.subscribe(() => {
        this._pointerDown = false;
        this._startX = undefined;
        this._startY = undefined;
        this.isDragging.set(false);
      });

      this._pointerMoveEvent.subscribe(event => {
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
