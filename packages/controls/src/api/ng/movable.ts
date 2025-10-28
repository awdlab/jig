import {
  computed,
  Directive,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { signalWithPrevious } from '@ngneers/controls/utils-ng';
import { movableDirectiveTemplate } from '@ngneers/controls-themes/templates/api';

import { domEventSignal } from './dom';
import { injectThemeTemplate } from './theme-service';

@Directive({ selector: '[ngnMovable]' })
export class NgnMovable {
  private readonly _theme = injectThemeTemplate(movableDirectiveTemplate);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
  private readonly _document = inject(DOCUMENT);

  /**
   * Whether the element is movable.
   */
  public readonly ngnMovable = input<boolean | null | undefined | ''>(true);

  /**
   * The handle element used to drag the element. If omitted, the entire element will be used as the drag handle.
   * @default null
   */
  public readonly ngnMovableDragHandle = input<HTMLElement | null>(null);

  /**
   * When `true`, the cursor will change to indicate that the element / drag handle is movable.
   * @default true
   */
  public readonly ngnMovableChangeCursor = input(true);

  /**
   * When `true`, the movement will be limited to the viewport.
   * @default true
   */
  public readonly ngnMovableLimitToViewport = input(true);

  private readonly _ngnMovableDragHandleWithPrevious = signalWithPrevious(
    this.ngnMovableDragHandle,
    null
  );

  private readonly _eventElement = computed(() => {
    const handle = this.ngnMovableDragHandle();
    return handle ?? this._el.nativeElement;
  });

  private readonly _pointerDownSignal = domEventSignal(this._eventElement, 'pointerdown');
  private readonly _pointerMoveSignal = domEventSignal(this._document, 'pointermove');
  private readonly _pointerUpSignal = domEventSignal(this._document, 'pointerup');

  private readonly _isDragging = signal(false);
  private _startX = 0;
  private _startY = 0;

  constructor() {
    effect(() => {
      if (!this.ngnMovable()) {
        return;
      }
      const pointerDown = this._pointerDownSignal();
      // check if primary button or touch
      if (pointerDown && (pointerDown.button === 0 || pointerDown.pointerType === 'touch')) {
        this._isDragging.set(true);
        this._startX = pointerDown.clientX - this._el.nativeElement.offsetLeft;
        this._startY = pointerDown.clientY - this._el.nativeElement.offsetTop;
      }
    });

    effect(() => {
      if (!this.ngnMovable()) {
        return;
      }
      const pointerMove = this._pointerMoveSignal();
      if (pointerMove && untracked(this._isDragging)) {
        this._el.nativeElement.style.position = 'fixed';
        this._el.nativeElement.style.margin = 'unset';
        const newLeft = pointerMove.clientX - this._startX;
        const newTop = pointerMove.clientY - this._startY;

        if (this.ngnMovableLimitToViewport()) {
          const documentRect = this._document.documentElement.getBoundingClientRect();
          const elRect = this._el.nativeElement.getBoundingClientRect();

          const clampedLeft = Math.min(Math.max(newLeft, 0), documentRect.width - elRect.width);
          const clampedTop = Math.min(Math.max(newTop, 0), documentRect.height - elRect.height);

          this._el.nativeElement.style.left = `${clampedLeft}px`;
          this._el.nativeElement.style.top = `${clampedTop}px`;
          return;
        }

        this._el.nativeElement.style.left = `${pointerMove.clientX - this._startX}px`;
        this._el.nativeElement.style.top = `${pointerMove.clientY - this._startY}px`;
      }
    });

    effect(() => {
      if (!this.ngnMovable()) {
        return;
      }
      const pointerUp = this._pointerUpSignal();
      if (pointerUp && untracked(this._isDragging)) {
        this._isDragging.set(false);
      }
    });

    effect(() => {
      if (!this.ngnMovable()) {
        this._isDragging.set(false);
      }
    });

    effect(() => {
      this.refreshCursor();
    });
  }

  private refreshCursor() {
    const handle = this._ngnMovableDragHandleWithPrevious();
    if (handle.previous && handle.previous !== handle.current) {
      handle.previous.classList.remove(
        this._theme.class('drag-handle-grab'),
        this._theme.class('drag-handle-grabbing')
      );
    }
    if (!this.ngnMovable() || !this.ngnMovableChangeCursor()) {
      handle.current?.classList.remove(
        this._theme.class('drag-handle-grab'),
        this._theme.class('drag-handle-grabbing')
      );
      return;
    }
    if (this._isDragging()) {
      handle.current?.classList.add(this._theme.class('drag-handle-grabbing'));
      handle.current?.classList.remove(this._theme.class('drag-handle-grab'));
    } else {
      handle.current?.classList.add(this._theme.class('drag-handle-grab'));
      handle.current?.classList.remove(this._theme.class('drag-handle-grabbing'));
    }
  }
}
