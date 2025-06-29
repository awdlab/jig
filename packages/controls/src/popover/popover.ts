import { Component, computed, ElementRef, inject, Injector, input, viewChild } from '@angular/core';
import { autoPositionElement } from '@ngneers/controls/api';

@Component({
  selector: 'ngn-popover',
  templateUrl: './popover.html',
  styles: `
    div {
      background: red;
    }
  `,
})
export class Popover {
  public readonly anchor = input.required<HTMLElement>();
  private readonly _popoverRef = viewChild<ElementRef<HTMLElement>>('popover');
  private readonly _popover = computed(() => this._popoverRef()?.nativeElement);
  private readonly _injector = inject(Injector);
  private readonly _autoPos = autoPositionElement(this.anchor, this._popover, {
    injector: this._injector,
    stopped: true,
  });

  public open() {
    this._autoPos.start();
    this._popover()?.togglePopover();
  }

  protected onToggle(event: Event) {
    const evt = event as ToggleEvent;
    if (evt.newState === 'closed') {
      this._autoPos.stop();
    }
  }
}
