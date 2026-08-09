import {
  booleanAttribute,
  Directive,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  domEventHandler,
  domEventSignal,
  elementSizeSignal,
  injectThemeTemplate,
  Platform,
} from '@awdlab/jig/api/ng';
import { resizableDirectiveTemplate } from '@awdlab/jig-themes/templates/api';

import { AwdMovable } from './movable';

/** Side length (px) of the browser's native resize grip. */
const GRIP_SIZE = 16;

/**
 * Clamps a natively resizable element (one with CSS `resize`) so it can never
 * be dragged past the viewport, and applies optional min/max size limits.
 *
 * It does not implement the resize gesture itself — the theme's `resizable`
 * part supplies the CSS `resize` handle; this directive observes the resulting
 * size changes while the pointer is down and writes the clamped
 * `min-*`/`max-*` styles. On a host that is also {@link AwdMovable}, the
 * position is baked first so the element does not jump.
 *
 * @category directive
 */
@Directive({
  selector: '[ngnResizable]',
  host: {
    '[class]': 'theme.classes({ resizable: ngnResizable(), resized: resized()})',
  },
})
export class AwdResizable {
  protected readonly theme = injectThemeTemplate(resizableDirectiveTemplate);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
  private readonly _isBrowser = inject(Platform).isBrowser;
  private readonly _document = inject(DOCUMENT);
  private readonly _ngnMovable = inject(AwdMovable, { optional: true });
  private _isPointerDown = false;

  /**
   * Whether the element is resizable. The empty string (bare attribute) enables it.
   * @default true
   */
  public readonly ngnResizable = input(true, { transform: booleanAttribute });
  /**
   * Minimum and maximum size constraints for the resizable element. Number values
   * are treated as pixels; strings are used as-is. Any bound left `null`/`undefined`
   * is unconstrained (the effective maximum is still clamped to the viewport).
   */
  public readonly ngnResizableSizeLimits = input<{
    minWidth: string | number | null | undefined;
    minHeight: string | number | null | undefined;
    maxWidth: string | number | null | undefined;
    maxHeight: string | number | null | undefined;
  }>();

  protected readonly resized = signal(false);

  private readonly _pointerUpSignal = domEventSignal(this._document, 'pointerup');
  private readonly _pointerCancelSignal = domEventSignal(this._document, 'pointercancel');

  private readonly _resizeEvent = elementSizeSignal(this._el);

  /**
   * Formats a size value from string | number | null | undefined to a CSS string.
   * @param value The size value to format
   * @returns The formatted CSS string or null if the value is null/undefined
   */
  private formatSizeValue(value: string | number | null | undefined): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    return typeof value === 'number' ? `${value}px` : value;
  }

  /**
   * Whether the pointer landed on the host's native resize grip (bottom-right corner).
   * The grip is drawn on the element itself, so a hit on a child is never one.
   */
  private isOnGrip(event: PointerEvent): boolean {
    const el = this._el.nativeElement;
    if (event.target !== el || getComputedStyle(el).resize === 'none') {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.right - event.clientX <= GRIP_SIZE && rect.bottom - event.clientY <= GRIP_SIZE;
  }

  constructor() {
    // claimed during dispatch, not in an effect: a batched flush would run AwdMovable's
    // pointermove handling before the claim and move the element
    domEventHandler(this._el, 'pointerdown', pointerDown => {
      if (!this.ngnResizable()) {
        return;
      }
      this._isPointerDown = true;
      // the grip owns this gesture — a co-hosted AwdMovable must not also move the element
      this._ngnMovable?.blockGesture(this.isOnGrip(pointerDown) ? pointerDown : null);
    });

    // touch scrolling takes the pointer over and fires pointercancel instead of pointerup
    effect(() => {
      if (this._pointerUpSignal() || this._pointerCancelSignal()) {
        this._isPointerDown = false;
      }
    });

    effect(() => {
      if (!this._isBrowser || !this.ngnResizable()) {
        return;
      }
      const _size = this._resizeEvent(); // just as the trigger
      if (!this._isPointerDown) {
        // only react to resize events when the pointer is down (user is resizing)
        return;
      }

      // If the element is also movable, bake its position to avoid misplacement after resizing
      this._ngnMovable?.bakePosition();

      // calculate the max width & height of the element based on the size, position & body

      const bodyWidth = this._document.body.clientWidth;
      const bodyHeight = this._document.body.clientHeight;

      const elRect = this._el.nativeElement.getBoundingClientRect();

      const maxWidth = bodyWidth - elRect.left;
      const maxHeight = bodyHeight - elRect.top;

      const inputMaxWidth = this.ngnResizableSizeLimits()?.maxWidth;
      const inputMaxHeight = this.ngnResizableSizeLimits()?.maxHeight;
      const formattedMaxWidth = this.formatSizeValue(inputMaxWidth);
      const formattedMaxHeight = this.formatSizeValue(inputMaxHeight);

      this._el.nativeElement.style.maxWidth = formattedMaxWidth
        ? `min(${formattedMaxWidth}, ${maxWidth}px)`
        : `${maxWidth}px`;
      this._el.nativeElement.style.maxHeight = formattedMaxHeight
        ? `min(${formattedMaxHeight}, ${maxHeight}px)`
        : `${maxHeight}px`;

      const inputMinWidth = this.ngnResizableSizeLimits()?.minWidth;
      const inputMinHeight = this.ngnResizableSizeLimits()?.minHeight;
      const formattedMinWidth = this.formatSizeValue(inputMinWidth);
      const formattedMinHeight = this.formatSizeValue(inputMinHeight);

      if (formattedMinWidth) {
        this._el.nativeElement.style.minWidth = formattedMinWidth;
      }
      if (formattedMinHeight) {
        this._el.nativeElement.style.minHeight = formattedMinHeight;
      }

      this.resized.set(true);
    });
  }
}
