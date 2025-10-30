import { Directive, DOCUMENT, effect, ElementRef, inject, input, signal } from '@angular/core';
import { resizableDirectiveTemplate } from '@ngneers/controls-themes/templates/api';

import { domEventSignal, elementSizeSignal } from './dom';
import { NgnMovable } from './movable';
import { Platform } from './platform';
import { injectThemeTemplate } from './theme-service';

@Directive({
  selector: '[ngnResizable]',
  host: {
    '[class]': '_theme.classes({ resizable: !!ngnResizable(), resized: resized()})',
  },
})
export class NgnResizable {
  protected readonly _theme = injectThemeTemplate(resizableDirectiveTemplate);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
  private readonly _isBrowser = inject(Platform).isBrowser;
  private readonly _document = inject(DOCUMENT);
  private readonly _ngnMovable = inject(NgnMovable, { optional: true });
  private _isPointerDown = false;

  /**
   * Whether the element is resizable.
   */
  public readonly ngnResizable = input<boolean | null | undefined | ''>(true);
  /**
   * The maximum size of the resizable element.
   */
  public readonly ngnResizableSizeLimits = input<{
    minWidth: string | number | null | undefined;
    minHeight: string | number | null | undefined;
    maxWidth: string | number | null | undefined;
    maxHeight: string | number | null | undefined;
  }>();

  protected readonly resized = signal(false);

  private readonly _pointerDownSignal = domEventSignal(this._el, 'pointerdown');
  private readonly _pointerUpSignal = domEventSignal(this._document, 'pointerup');

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

  constructor() {
    effect(() => {
      if (this._pointerDownSignal()) {
        this._isPointerDown = true;
      }
    });

    effect(() => {
      if (this._pointerUpSignal()) {
        this._isPointerDown = false;
      }
    });

    effect(() => {
      if (!this._isBrowser) {
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
