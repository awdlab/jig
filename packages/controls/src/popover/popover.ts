import { Component, computed, ElementRef, inject, Injector, input, viewChild } from '@angular/core';
import {
  autoPositionElement,
  AutoPositioningHandle,
  PositioningOptions,
} from '@ngneers/controls/api';
import { computedWithPrevious } from '@ngneers/controls/utils';

export type PopoverOptions = {
  sizeConstraints?: PositioningOptions['sizeConstraints'];
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
      sizeConstraints: this.options()?.sizeConstraints,
    });
  });

  public open() {
    if (this.isOpen) {
      return;
    }
    this._autoPos()?.start();
    this._popover()?.togglePopover();
  }

  public get isOpen() {
    return this._popover()?.matches(':popover-open') ?? false;
  }

  public close() {
    if (!this.isOpen) {
      return;
    }
    this._popover()?.togglePopover();
  }

  protected onToggle(event: Event) {
    const evt = event as ToggleEvent;
    if (evt.newState === 'closed') {
      this._autoPos()?.stop();
    }
  }
}
