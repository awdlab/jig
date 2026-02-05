import {
  afterRenderEffect,
  Directive,
  DOCUMENT,
  ElementRef,
  inject,
  output,
  signal,
} from '@angular/core';
import { domEventHandler, domEventObservable, Platform } from '@ngneers/controls/api/ng';

import type { NgnDragInfo } from './types';

@Directive()
export abstract class NgnDragBase {
  protected readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _document = inject(DOCUMENT);
  private readonly _isBrowser = inject(Platform).isBrowser;

  private _pointerDown = false;
  private _startX?: number = undefined;
  private _startY?: number = undefined;

  protected readonly isDragging = signal(false);
  public readonly dragStart = output<void>();
  public readonly dragEnd = output<void>();
  public readonly dragged = output<NgnDragInfo>();

  private readonly _pointerDownEvent = domEventObservable(this.el.nativeElement, 'pointerdown');
  private readonly _pointerMoveEvent = domEventObservable(this._document, 'pointermove');
  private readonly _pointerUpEvent = domEventObservable(this._document, 'pointerup');

  constructor() {
    if (!this._isBrowser) {
      return;
    }
    domEventHandler(this.el.nativeElement, 'touchmove', e => {
      if (e.cancelable) {
        e.preventDefault();
      }
    });
    afterRenderEffect(() => {
      this._pointerDownEvent.subscribe(event => {
        this._pointerDown = true;
        this._startX = (event as PointerEvent).clientX;
        this._startY = (event as PointerEvent).clientY;
      });
      this._pointerUpEvent.subscribe(() => {
        if (!this._pointerDown) {
          return;
        }
        this._pointerDown = false;
        this._startX = undefined;
        this._startY = undefined;
        this.isDragging.set(false);
        this.dragEnd.emit();
      });

      this._pointerMoveEvent.subscribe(event => {
        if (!this._pointerDown) {
          return;
        }
        this.handleDrag(event);
      });
    });
  }

  protected abstract onDragged(delta: NgnDragInfo): void;

  private onDraggedInt(delta: NgnDragInfo) {
    this.dragged.emit(delta);
    this.onDragged(delta);
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
      this.dragStart.emit();
    }
    if (!this.isDragging()) {
      return;
    }
    this._startX = clientX;
    this._startY = clientY;
    this.onDraggedInt({ deltaX: deltaX, deltaY: deltaY, absoluteX: clientX, absoluteY: clientY });
  }
}
