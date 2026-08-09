import { Directive } from '@angular/core';

import { AwdDragBase } from './drag-base';

import type { AwdDragInfo } from './types';

/**
 * Drag-to-scroll ("grab and pan") for its host: the same gesture as
 * {@link AwdDrag}, but each move scrolls the host by the inverse delta.
 *
 * Put it on the scrolling element itself. Because the gesture cancels the
 * synthesized click, panning across interactive children does not activate
 * them.
 *
 * @category directive
 */
@Directive({
  selector: '[ngnDragScroll]',
})
export class AwdDragScroll extends AwdDragBase {
  protected onDragged(delta: AwdDragInfo): void {
    this.el.nativeElement.scrollBy({
      left: -delta.deltaX,
      top: -delta.deltaY,
      behavior: 'auto',
    });
  }
}
