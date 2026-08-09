import { Directive } from '@angular/core';

import { AwdDragBase } from './drag-base';

import type { AwdDragInfo } from './types';

/**
 * Reports pointer drag gestures on its host without moving anything: it emits
 * `dragStart`, `dragged` (per pointer move, with deltas) and `dragEnd`, leaving
 * the reaction to you.
 *
 * A gesture only starts after the pointer travels 5px, and the click the
 * browser synthesizes on release is swallowed so a drag never triggers the
 * host's click handlers.
 *
 * @category directive
 */
@Directive({
  selector: '[ngnDrag]',
})
export class AwdDrag extends AwdDragBase {
  protected onDragged(delta: AwdDragInfo): void {
    // do nothing
  }
}
