import {
  Component,
  computed,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';

import { autoPositionElement } from '../api/positioning';

@Component({
  selector: 'ngn-popover',
  templateUrl: './popover.html',
})
export class Popover {
  public readonly anchor = input.required<HTMLElement>();
  private readonly _popoverRef = viewChild<ElementRef<HTMLElement>>('popover');
  private readonly _popover = computed(() => this._popoverRef()?.nativeElement);

  constructor() {
    autoPositionElement(this.anchor, this._popover, {});
  }

  public open() {
    this._popover()?.togglePopover();
  }
}
