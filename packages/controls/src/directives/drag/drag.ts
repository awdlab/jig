import { Directive } from '@angular/core';

import { NgnDragBase } from './drag-base';
import { NgnDragInfo } from './types';

@Directive({
  selector: '[ngnDrag]',
})
export class NgnDrag extends NgnDragBase {
  protected onDragged(delta: NgnDragInfo): void {
    // do nothing
  }
}
