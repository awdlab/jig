import { Directive } from '@angular/core';

import { NgnDragBase } from './drag-base';
import { NgnDragInfo } from './types';

@Directive({
  selector: '[ngnDragScroll]',
})
export class NgnDragScroll extends NgnDragBase {
  protected onDragged(delta: NgnDragInfo): void {
    this.el.nativeElement.scrollBy({
      left: -delta.deltaX,
      top: -delta.deltaY,
      behavior: 'auto',
    });
  }
}
