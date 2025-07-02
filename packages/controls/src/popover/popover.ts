import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  autoPositionElement,
  AutoPositioningHandle,
  PositioningSizeConstraints,
} from '@ngneers/controls/api';
import { computedWithPrevious } from '@ngneers/controls/utils';

export type PopoverOptions = {
  /**
   * Constraints for the size of the popover.
   */
  sizeConstraints?: PositioningSizeConstraints;
  /**
   * If true, the content of the popover will be cached and not recreated on each open.
   * This is useful for performance when the content is expensive to create.
   */
  cache?: boolean;
};
@Component({
  selector: 'ngn-popover',
  templateUrl: './popover.html',
  imports: [NgTemplateOutlet],
})
export class Popover {
  public readonly anchor = input.required<HTMLElement>();
  public readonly options = input<PopoverOptions>();

  protected readonly lazyContent = contentChild<TemplateRef<unknown>>('content');
  protected readonly hasBeenOpened = signal(false);

  protected readonly appliedOptions = computed(() => ({
    cache: false,
    ...this.options(),
  }));

  public readonly opened = output();
  public readonly closed = output();

  private readonly _isOpen = signal(false);
  public readonly isOpen = this._isOpen.asReadonly();

  private readonly _injector = inject(Injector);
  private readonly _popoverRef = viewChild<ElementRef<HTMLElement>>('popover');
  private readonly _popover = computed(() => this._popoverRef()?.nativeElement);
  private readonly _autoPos = computedWithPrevious<AutoPositioningHandle | undefined>(prev => {
    prev?.stop();
    const popoverEl = this._popover();
    if (!popoverEl) {
      return undefined;
    }
    return autoPositionElement(this.anchor(), popoverEl, {
      injector: this._injector,
      stopped: true,
      sizeConstraints: this.appliedOptions()?.sizeConstraints,
    });
  });

  public open() {
    if (this.isOpen()) {
      return;
    }
    this.hasBeenOpened.set(true);
    this._autoPos()?.start();
    this._popover()?.togglePopover();
  }

  public toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  public close() {
    if (!this.isOpen()) {
      return;
    }
    this._popover()?.togglePopover();
  }

  protected onToggle(event: Event) {
    const evt = event as ToggleEvent;
    if (evt.newState === 'closed') {
      this._isOpen.set(false);
      this.closed.emit();
      this._autoPos()?.stop();
    } else {
      this._isOpen.set(true);
      this.opened.emit();
    }
  }
}
