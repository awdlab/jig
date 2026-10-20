import {
  afterRenderEffect,
  DestroyRef,
  Directive,
  DOCUMENT,
  ElementRef,
  inject,
  output,
  signal,
} from '@angular/core';
import { domEventHandler, domEventObservable, Platform } from '@awdlab/jig/api/ng';

import type { JigDragInfo } from './types';

@Directive()
export abstract class JigDragBase {
  protected readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _document = inject(DOCUMENT);
  private readonly _isBrowser = inject(Platform).isBrowser;

  private _pointerDown = false;
  private _startX?: number = undefined;
  private _startY?: number = undefined;
  private _dragged = false;
  private _previousUserSelect: string | null = null;

  protected readonly isDragging = signal(false);
  /**
   * Emits once when a drag gesture begins, i.e. after the pointer has moved past
   * the small activation threshold following a pointerdown.
   */
  public readonly dragStart = output<void>();
  /**
   * Emits once when the drag gesture ends (pointer released).
   */
  public readonly dragEnd = output<void>();
  /**
   * Emits on every pointer move while dragging, carrying the frame delta and
   * absolute pointer position. See {@link JigDragInfo}.
   */
  public readonly dragged = output<JigDragInfo>();

  private readonly _pointerDownEvent = domEventObservable(this.el.nativeElement, 'pointerdown');
  private readonly _pointerMoveEvent = domEventObservable(this._document, 'pointermove');
  private readonly _pointerUpEvent = domEventObservable(this._document, 'pointerup');

  constructor() {
    if (!this._isBrowser) {
      return;
    }
    inject(DestroyRef).onDestroy(() => this.suppressSelection(false));
    domEventHandler(this.el.nativeElement, 'touchmove', e => {
      if (e.cancelable) {
        e.preventDefault();
      }
    });
    // Swallow the click that the browser synthesizes after a drag-release so it
    // does not trigger click handlers (e.g. selecting a tab). Capture phase so
    // it runs before bubbling handlers on descendant elements.
    domEventHandler(
      this.el.nativeElement,
      'click',
      e => {
        if (this._dragged) {
          this._dragged = false;
          e.preventDefault();
          e.stopPropagation();
        }
      },
      undefined,
      { capture: true }
    );
    afterRenderEffect(() => {
      this._pointerDownEvent.subscribe(event => {
        this._pointerDown = true;
        this._dragged = false;
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
        this.suppressSelection(false);
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

  protected abstract onDragged(delta: JigDragInfo): void;

  private onDraggedInt(delta: JigDragInfo) {
    this.dragged.emit(delta);
    this.onDragged(delta);
  }

  /**
   * Suppresses text selection for the length of the gesture, document-wide rather than on
   * the host: WebKit starts a selection at a pointerdown inside a `user-select: none`
   * subtree and extends it into whatever is selectable around it — a sibling field label,
   * say — so host-scoped suppression does not hold there.
   */
  private suppressSelection(suppress: boolean) {
    const body = this._document.body;
    if (suppress) {
      this._previousUserSelect ??= body.style.userSelect;
      body.style.userSelect = 'none';
      this._document.getSelection()?.removeAllRanges();
    } else if (this._previousUserSelect !== null) {
      body.style.userSelect = this._previousUserSelect;
      this._previousUserSelect = null;
    }
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
      this.suppressSelection(true);
      this._dragged = true;
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
