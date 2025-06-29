import { Component, computed, ElementRef, inject, Injector, input, viewChild } from '@angular/core';
import { autoPositionElement, AutoPositioningHandle } from '@ngneers/controls/api';
import { computedWithPrevious } from 'packages/controls/src/utils/signals';

export type PopoverOptions = {
  /**
   * The width of the popover relative to the width of the anchor element.
   */
  width?: number;
  /**
   * The maximum width of the popover relative to the width of the anchor element.
   */
  maxWidth?: number;
};
@Component({
  selector: 'ngn-popover',
  templateUrl: './popover.html',
})
export class Popover {
  public readonly anchor = input.required<HTMLElement>();

  public readonly options = input<PopoverOptions>();

  private readonly _popoverRef = viewChild<ElementRef<HTMLElement>>('popover');
  private readonly _popover = computed(() => this._popoverRef()?.nativeElement);
  private readonly _injector = inject(Injector);
  private readonly _autoPos = computedWithPrevious<AutoPositioningHandle | undefined>(prev => {
    prev?.stop();
    const popoverEl = this._popover();
    if (!popoverEl) {
      return undefined;
    }
    return autoPositionElement(this.anchor(), popoverEl, {
      injector: this._injector,
      stopped: true,
      widthConstraints: {
        width: this.options()?.width,
        maxWidth: this.options()?.maxWidth,
      },
    });
  });

  public open() {
    this._autoPos()?.start();
    this._popover()?.togglePopover();
  }

  protected onToggle(event: Event) {
    const evt = event as ToggleEvent;
    if (evt.newState === 'closed') {
      this._autoPos()?.stop();
    }
  }
}
