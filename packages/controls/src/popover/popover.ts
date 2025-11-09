import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  output,
  signal,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';
import {
  PopoverCloseBy,
  toPopoverCloseBy,
  autoPositionElement,
  AutoPositioningHandle,
  Openable,
} from '@ngneers/controls/api/ng';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { computedWithPrevious } from '@ngneers/controls/utils-ng';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';

import { Anchor, PopoverOptions } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-popover',
  templateUrl: './popover.html',
  imports: [NgClass, NgnDefer],
  providers: [provideSelf(NgnPopover)],
})
export class NgnPopover extends NgnBase<'popover'> implements Openable {
  protected readonly theme = this.injectThemeTemplate(popoverControlTemplate);

  /**
   * Emits when the popover has fully closed.
   */
  public readonly closed = output();
  /**
   * Emits when the popover is closed.
   */
  public readonly closing = output();
  /**
   * Shows or hides the popover.
   *
   * You probably want to react to openChange events from outside to update your variable accordingly.
   */
  public readonly open = model<boolean>(false);
  /**
   * The element to which the popover is anchored.
   */
  public readonly anchor = input.required<Anchor>();
  /**
   * The popover options.
   */
  public readonly options = input<PopoverOptions>();
  /**
   * Set to true for scrollable/shrink-able content
   */
  public readonly hasShrinkableContent = input<boolean>(false);
  /**
   * How the drawer closes depending on user interaction.
   * @default 'any'
   */
  public readonly closeBy = input<PopoverCloseBy>('any');

  protected readonly lazyContent = contentChild<TemplateRef<unknown>>('lazy');
  protected readonly _content = viewChild.required<ElementRef<HTMLElement>>('content');
  protected readonly closeByPopover = computed(() => toPopoverCloseBy(this.closeBy()));
  protected readonly isFullyClosed = signal(true);

  private _skipEmitCloseEvent = false;
  private _triggeredByInput = false;

  protected readonly appliedOptions = computed(() => ({
    cache: false,
    ...this.options(),
  }));

  private readonly _injector = inject(Injector);
  private readonly _popoverRef = viewChild.required<ElementRef<HTMLElement>>('popover');
  private readonly _popover = computed(() => this._popoverRef().nativeElement);
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

  /**
   * Opens the drawer. Alternatively, you can also set the `open` input to `true`.
   */
  public show() {
    untracked(() => {
      if (this.open() && !this._triggeredByInput) {
        return;
      }
      this._triggeredByInput = false;
      this._autoPos()?.start();
      this._popover().togglePopover(true);
    });
  }

  /**
   * Closes the drawer. Alternatively, you can also set the `open` input to `false`.
   */
  public hide(emitCloseEvent = true) {
    untracked(() => {
      if (!this.open() && !this._triggeredByInput) {
        return;
      }
      this._triggeredByInput = false;
      this._skipEmitCloseEvent = !emitCloseEvent;
      this._autoPos()?.stop();
      this._popover().togglePopover(false);
    });
  }

  /**
   * Toggles the drawer open or closed. Alternatively, you can also set the `open` input accordingly.
   */
  public toggle() {
    if (untracked(this.open)) {
      this.hide();
    } else {
      this.show();
    }
  }

  protected onToggle(event: Event) {
    const evt = event as ToggleEvent;
    if (evt.newState === 'closed') {
      this.open.set(false);

      if (this._skipEmitCloseEvent) {
        this._skipEmitCloseEvent = false;
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
      this.open.set(true);
      this.isFullyClosed.set(false);
    }
  }
}
