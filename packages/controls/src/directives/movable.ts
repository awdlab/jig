import {
  booleanAttribute,
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
import { domEventHandler, domEventSignal } from '@ngneers/controls/api/ng';
import { NgnBase } from '@ngneers/controls/base';
import { signalWithPrevious } from '@ngneers/controls/utils-ng';
import { movableDirectiveTemplate } from '@ngneers/controls-themes/templates/api';

/**
 * Makes its host element draggable with the pointer by writing `left`/`top`
 * inline styles (and switching the host to `position: fixed` when it is not
 * already positioned).
 *
 * Combine with {@link NgnResizable} — the resize logic calls
 * {@link NgnMovable.bakePosition} so a resized element keeps its place.
 *
 * @category directive
 */
@Directive({
  selector: '[ngnMovable]',
})
export class NgnMovable extends NgnBase<'movable'> {
  protected readonly theme = this.injectThemeTemplate(movableDirectiveTemplate, {
    movable: () => this.ngnMovable(),
    moved: () => this.dragged(),
  });
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
  private readonly _document = inject(DOCUMENT);

  /**
   * Whether the element is movable.
   * @default true
   */
  public readonly ngnMovable = input(true, { transform: booleanAttribute });

  /**
   * The handle element used to drag the element. If omitted, the entire element will be used as the drag handle.
   * @default null
   */
  public readonly ngnMovableDragHandle = input<HTMLElement | null>(null);

  /**
   * When `true`, the cursor will change to indicate that the element / drag handle is movable.
   * @default true
   */
  public readonly ngnMovableChangeCursor = input(true, { transform: booleanAttribute });

  /**
   * When `true`, the movement will be limited to the viewport.
   * @default true
   */
  public readonly ngnMovableLimitToViewport = input(true, { transform: booleanAttribute });

  private readonly _ngnMovableDragHandleWithPrevious = signalWithPrevious(
    this.ngnMovableDragHandle,
    null
  );

  private readonly _eventElement = computed(() => {
    const handle = this.ngnMovableDragHandle();
    return handle ?? this._el.nativeElement;
  });

  protected readonly dragged = signal(false);

  private readonly _pointerDownSignal = domEventSignal(this._eventElement, 'pointerdown');
  private readonly _pointerMoveSignal = domEventSignal(this._document, 'pointermove');
  private readonly _pointerUpSignal = domEventSignal(this._document, 'pointerup');
  private readonly _pointerCancelSignal = domEventSignal(this._document, 'pointercancel');

  private readonly _isDragging = signal(false);
  private _startX = 0;
  private _startY = 0;
  private _blockedDown: PointerEvent | null = null;

  constructor() {
    super();

    domEventHandler(this._el.nativeElement, 'touchmove', e => {
      if (!this.ngnMovable()) {
        return;
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    });

    effect(() => {
      if (!this.ngnMovable()) {
        return;
      }
      const pointerDown = this._pointerDownSignal();
      // check if primary button or touch
      if (pointerDown && (pointerDown.button === 0 || pointerDown.pointerType === 'touch')) {
        if (pointerDown === this._blockedDown) {
          return;
        }
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
        this.dragged.set(true);
        const newLeft = pointerMove.clientX - this._startX;
        const newTop = pointerMove.clientY - this._startY;

        if (this.ngnMovableLimitToViewport()) {
          const documentRect = this._document.documentElement.getBoundingClientRect();
          const elRect = this._el.nativeElement.getBoundingClientRect();

          const clampedLeft = Math.min(Math.max(newLeft, 0), documentRect.width - elRect.width);
          const clampedTop = Math.min(Math.max(newTop, 0), documentRect.height - elRect.height);

          this._el.nativeElement.style.left = `${clampedLeft}px`;
          this._el.nativeElement.style.top = `${clampedTop}px`;
        } else {
          this._el.nativeElement.style.left = `${pointerMove.clientX - this._startX}px`;
          this._el.nativeElement.style.top = `${pointerMove.clientY - this._startY}px`;
        }

        this._el.nativeElement.style.width = `${this._el.nativeElement.offsetWidth}px`;
        this._el.nativeElement.style.height = `${this._el.nativeElement.offsetHeight}px`;
        if (
          !['fixed', 'absolute', 'static'].includes(
            getComputedStyle(this._el.nativeElement).position
          )
        ) {
          this._el.nativeElement.style.position = 'fixed';
        }
      }
    });

    effect(() => {
      if (!this.ngnMovable()) {
        return;
      }
      // touch scrolling takes the pointer over and fires pointercancel instead of pointerup
      const pointerEnd = this._pointerUpSignal() ?? this._pointerCancelSignal();
      if (pointerEnd && untracked(this._isDragging)) {
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

  /**
   * Hands a gesture to another directive on the same host, so it does not double as a
   * move. {@link NgnResizable} passes the `pointerdown` its grip owns, `null` otherwise.
   */
  public blockGesture(pointerDown: PointerEvent | null): void {
    this._blockedDown = pointerDown;
  }

  public bakePosition() {
    this._el.nativeElement.style.left = `${this._el.nativeElement.offsetLeft}px`;
    this._el.nativeElement.style.top = `${this._el.nativeElement.offsetTop}px`;
    if (
      !['fixed', 'absolute', 'static'].includes(getComputedStyle(this._el.nativeElement).position)
    ) {
      this._el.nativeElement.style.position = 'fixed';
    }
    this.dragged.set(true);
  }

  private refreshCursor() {
    const handle = this._ngnMovableDragHandleWithPrevious();
    if (handle.previous && handle.previous !== handle.current) {
      handle.previous.classList.remove(
        this.theme.class('drag-handle-grab'),
        this.theme.class('drag-handle-grabbing')
      );
    }
    if (!this.ngnMovable() || !this.ngnMovableChangeCursor()) {
      handle.current?.classList.remove(
        this.theme.class('drag-handle-grab'),
        this.theme.class('drag-handle-grabbing')
      );
      return;
    }
    if (this._isDragging()) {
      handle.current?.classList.add(this.theme.class('drag-handle-grabbing'));
      handle.current?.classList.remove(this.theme.class('drag-handle-grab'));
    } else {
      handle.current?.classList.add(this.theme.class('drag-handle-grab'));
      handle.current?.classList.remove(this.theme.class('drag-handle-grabbing'));
    }
  }
}
