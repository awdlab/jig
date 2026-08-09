import { Directive } from '@angular/core';

import { JigDragBase } from './drag-base';

import type { JigDragInfo } from './types';

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
  selector: '[jigDrag]',
})
export class JigDrag extends JigDragBase {
  protected onDragged(delta: JigDragInfo): void {
    // do nothing
  }
}
