import { NgClass } from '@angular/common';
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
import { autoPositionElement, AutoPositioningHandle } from '@ngneers/controls/api/ng';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { computedWithPrevious } from '@ngneers/controls/utils-ng';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';

import { PopoverOptions } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-popover',
  templateUrl: './popover.html',
  imports: [NgClass, NgnDefer],
  providers: [provideSelf(NgnPopover)],
})
export class NgnPopover extends NgnBase<'popover'> {
  protected readonly theme = this.injectThemeTemplate(popoverControlTemplate);
  public readonly anchor = input.required<HTMLElement>();
  public readonly options = input<PopoverOptions>();
  /**
   * Set to true for scrollable/shrink-able content
   */
  public readonly hasShrinkableContent = input<boolean>(false);

  protected readonly lazyContent = contentChild<TemplateRef<unknown>>('lazy');
  protected readonly _content = viewChild.required<ElementRef<HTMLElement>>('content');

  private _skipNextCloseEvent = false;

  protected readonly appliedOptions = computed(() => ({
    cache: false,
    ...this.options(),
  }));

  public readonly opened = output();
  public readonly closing = output();
  public readonly closed = output();

  private readonly _isOpen = signal(false);
  public readonly isOpen = this._isOpen.asReadonly();
  protected readonly isFullyClosed = signal(true);

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
      placement: this.appliedOptions()?.placement,
      offset: this.appliedOptions()?.padding,
      hasShrinkableContent: this.hasShrinkableContent(),
    });
  });

  public open() {
    if (this.isOpen()) {
      return;
    }
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

  public close(emitCloseEvent = true) {
    if (!this.isOpen()) {
      return;
    }
    this._autoPos()?.stop();
    if (!emitCloseEvent) {
      this._skipNextCloseEvent = true;
    }
    this._popover()?.togglePopover();
  }

  protected onToggle(event: Event) {
    const evt = event as ToggleEvent;
    if (evt.newState === 'closed') {
      this._isOpen.set(false);

      if (this._skipNextCloseEvent) {
        this._skipNextCloseEvent = false;
      } else {
        this.closing.emit();
      }
      this._autoPos()?.stop();

      requestAnimationFrame(() => {
        const allAnimationsDone = Promise.all(
          this._content()
            .nativeElement.getAnimations()
            .map(x => x.finished)
        );
        allAnimationsDone
          .then(() => {
            this.isFullyClosed.set(true);
            this.closed.emit();
          })
          .catch(() => {
            // ignore cancelled animation
          });
      });
    } else {
      this._isOpen.set(true);
      this.opened.emit();
      this.isFullyClosed.set(false);
    }
  }
}
