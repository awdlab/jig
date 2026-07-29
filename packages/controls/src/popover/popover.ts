import {
  booleanAttribute,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  type PopoverCloseBy,
  toPopoverCloseBy,
  autoPositionElement,
  type AutoPositioningHandle,
  type Openable,
  type Anchor,
} from '@ngneers/controls/api/ng';
import { provideSelf, NgnPt } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { computedWithPrevious, explicitAfterRenderEffect } from '@ngneers/controls/utils-ng';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';

import { PopoverTemplates } from './popover-templates';

import type { PopoverOptions } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-popover',
  templateUrl: './popover.html',
  imports: [NgnPt, NgnDefer],
  providers: [provideSelf(NgnPopover)],
  host: {
    '(click)': '$event.stopPropagation()',
  },
})
export class NgnPopover extends PopoverTemplates implements Openable {
  protected readonly theme = this.injectThemeTemplate(popoverControlTemplate, 'root');

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
  public readonly hasShrinkableContent = input(false, { transform: booleanAttribute });
  /**
   * How the popover closes depending on user interaction.
   * @default any
   */
  public readonly closeBy = input<PopoverCloseBy>('any');

  protected readonly _content = viewChild.required<ElementRef<HTMLElement>>('content');
  protected readonly closeByPopover = computed(() => toPopoverCloseBy(this.closeBy()));
  protected readonly isFullyClosed = signal(true);

  private _skipEmitCloseEvent = false;
  private _triggeredByInput = false;
  // Set by `onToggle` when the open state changed because the popover itself
  // toggled (native show/hide). The `[open]` effect then skips re-running
  // show()/hide() for that echo — otherwise the redundant show() schedules a
  // second deferred `togglePopover(true)` that can re-open the popover right
  // after a quick close (e.g. Enter then Escape). The effect still reacts to
  // genuine external `[open]` input changes.
  private _internalToggle = false;
  private _destroyed = false;

  protected readonly appliedOptions = computed(() => ({
    cache: false,
    ...this.options(),
  }));

  private readonly _injector = inject(Injector);
  private readonly _cdr = inject(ChangeDetectorRef);
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

  constructor() {
    super();

    inject(DestroyRef).onDestroy(() => (this._destroyed = true));

    explicitAfterRenderEffect([this.open], ([open]) => {
      // Ignore the echo from our own onToggle-driven open change; only react to
      // external `[open]` input changes.
      if (this._internalToggle) {
        this._internalToggle = false;
        return;
      }
      if (!open) {
        this._triggeredByInput = true;
        this.hide();
      }
      if (open) {
        this._triggeredByInput = true;
        this.show();
      }
    });
  }

  /**
   * Opens the popover. Alternatively, you can also set the {@link open} input to `true`.
   */
  public show() {
    untracked(() => {
      if (this._destroyed || (this.open() && !this._triggeredByInput)) {
        return;
      }
      this._triggeredByInput = false;
      this.isFullyClosed.set(false);
      this._cdr.detectChanges();
      requestAnimationFrame(() => {
        if (!this.isAttached()) {
          return;
        }
        this._autoPos()?.start();
        this._popover().togglePopover(true);
      });
    });
  }

  /**
   * Closes the popover. Alternatively, you can also set the {@link open} input to `false`.
   */
  public hide(emitCloseEvent = true) {
    untracked(() => {
      if (!this.isAttached() || (!this.open() && !this._triggeredByInput)) {
        return;
      }
      this._triggeredByInput = false;
      this._skipEmitCloseEvent = !emitCloseEvent;
      this._autoPos()?.stop();
      this._popover().togglePopover(false);
    });
  }

  /** Native popover APIs throw on disconnected elements, so callers holding a stale reference no-op. */
  private isAttached() {
    return !this._destroyed && this._popover().isConnected;
  }

  /**
   * Toggles the popover open or closed. Alternatively, you can also set the {@link open} input accordingly.
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
    // Mark this open-state change as internal so the `[open]` effect doesn't
    // echo it back into another show()/hide().
    this._internalToggle = true;
    if (evt.newState === 'closed') {
      this.open.set(false);

      if (this._skipEmitCloseEvent) {
        this._skipEmitCloseEvent = false;
      } else {
        this.closing.emit();
      }
      this._autoPos()?.stop();

      requestAnimationFrame(() => {
        if (this._destroyed) {
          return;
        }
        const allAnimationsDone = Promise.all(
          this._content()
            .nativeElement.getAnimations()
            .map(x => x.finished)
        );
        allAnimationsDone
          .then(() => {
            if (this._destroyed) {
              return;
            }
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
