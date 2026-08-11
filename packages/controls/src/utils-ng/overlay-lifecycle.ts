import { afterRenderEffect, computed, DestroyRef, inject, Injector, signal } from '@angular/core';

/**
 * How an overlay enters the top layer.
 *
 * - `modal` — `showModal()` / `close()`, no `popover` attribute.
 * - `popover` — `showPopover()` / `hidePopover()` with a configurable attribute value.
 * - `hint` — same, pinned to `popover="hint"` (tooltips: never light-dismisses other popovers).
 * - `manual` — `togglePopover()` with `popover="manual"`, for regions driven by a predicate.
 */
export type OverlayMode = 'modal' | 'popover' | 'hint' | 'manual';

/** Where an overlay is in its open/close cycle. */
export type OverlayPhase = 'closed' | 'opening' | 'open' | 'closing';

/**
 * The parts of an overlay control the lifecycle drives on its behalf. Structural on
 * purpose: any `Openable` satisfies it, and a spec can pass a plain object. `utils-ng`
 * cannot import `api/ng` — that dependency runs the other way.
 */
export type OverlayControl = {
  /**
   * The control's two-way open state. Read as the source of truth — setting it opens or
   * closes the overlay — and kept in step with the phase: `true` on open, `false` when
   * the close starts. An Angular `ModelSignal<boolean>` satisfies this shape.
   */
  open: (() => boolean) & { set(value: boolean): void };
  /** Emitted once the exit animation has finished. */
  closed?: { emit(): void };
  /** Emitted when the close starts, unless the close was silent. */
  closing?: { emit(): void };
};

export type OverlayLifecycleOptions = {
  /** Which native API drives the overlay. Re-read on every open. */
  mode: () => OverlayMode;
  /** The control whose model and outputs follow the phase — usually `this`. */
  control?: OverlayControl;
  /** Attribute value while open in `popover` mode. Defaults to `auto`. */
  popoverValue?: () => string | null | undefined;
  /** Drives open state from a predicate instead of explicit calls — for `manual` regions. */
  openWhen?: () => boolean;
  /** Defers the show call to the next frame, for overlays positioned before they appear. */
  deferShow?: boolean;
  /**
   * Keeps the overlay in the top layer until its exit animation has finished, instead of
   * hiding it immediately. For regions whose children animate themselves out — hiding the
   * host first would `display: none` the animation away.
   */
  deferHide?: boolean;
  /**
   * Waits on animations anywhere inside the overlay, not just on the element itself.
   * Infinite animations are skipped either way, so a looping child cannot wedge the close.
   */
  awaitSubtree?: boolean;
  /**
   * Element carrying the exit animation, when it is not the overlay element itself —
   * a popover wrapper is `display: none` while closed, so its inner content animates.
   */
  animationElement?: () => HTMLElement | null | undefined;
  /** Runs as soon as the phase enters `opening`, before any deferred frame. */
  onOpening?: () => void;
  /** Runs immediately before the native show call, inside the deferred frame. */
  onBeforeShow?: () => void;
  /** Fired once the overlay is in the top layer. */
  onOpened?: () => void;
  /** Fired when the close starts, before the exit animation. */
  onClosing?: () => void;
  /** Fired once the exit animation has finished and the overlay is fully torn down. */
  onClosed?: () => void;
  /** Required when constructed outside an injection context. */
  injector?: Injector;
};

/**
 * The open/close state machine shared by every overlay control.
 *
 * Owns three things the controls used to each re-implement: the phase machine, the
 * native show/hide call for the current {@link OverlayMode}, and the `popover`
 * attribute lifecycle (present only while open, so a closed overlay is not a
 * top-layer element). Everything else — light dismiss, focus, delays, deferred
 * content — stays with the control.
 *
 * The host wires its native `toggle`/`cancel` events into {@link onNativeToggle} so
 * user-driven closes (Escape, light dismiss) land in the same machine as programmatic
 * ones; no echo-suppression flags needed, the phase already says who is driving.
 */
export class OverlayLifecycle {
  private readonly _element: () => HTMLElement | null | undefined;
  private readonly _options: OverlayLifecycleOptions;
  private readonly _phase = signal<OverlayPhase>('closed');
  private readonly _hasBeenOpened = signal(false);
  private _destroyed = false;

  /** Current phase. */
  public readonly phase = this._phase.asReadonly();
  /** Whether the overlay is open or on its way there. */
  public readonly isOpen = computed(() => {
    const phase = this._phase();
    return phase === 'open' || phase === 'opening';
  });
  /** Whether the overlay is closed *and* done animating — the cue to unmount content. */
  public readonly isFullyClosed = computed(() => this._phase() === 'closed');
  /** Whether the overlay has been opened at least once. */
  public readonly hasBeenOpened = this._hasBeenOpened.asReadonly();

  constructor(element: () => HTMLElement | null | undefined, options: OverlayLifecycleOptions) {
    this._element = element;
    this._options = options;

    const injector = options.injector;
    const destroyRef = injector?.get(DestroyRef) ?? inject(DestroyRef);
    destroyRef.onDestroy(() => (this._destroyed = true));

    // Follow whichever source of truth the control has: an explicit predicate, or its
    // own `open` model. Both calls are no-ops when the phase already matches, so the
    // model updates this class makes cannot feed back into a loop.
    const isOpen = options.openWhen ?? options.control?.open;
    if (isOpen) {
      afterRenderEffect(
        () => {
          if (isOpen()) {
            this.show();
          } else {
            this.hide();
          }
        },
        injector ? { injector } : undefined
      );
    }
  }

  /** Opens the overlay. No-op when already open or opening. */
  public show(): void {
    if (this._destroyed || this.isOpen()) {
      return;
    }
    this._phase.set('opening');
    this._hasBeenOpened.set(true);
    // Sync the model now, not once the (possibly deferred) show lands — the effect that
    // follows the model would otherwise see a stale `false` and close this straight back.
    this.notify(() => {
      this._options.control?.open.set(true);
      this._options.onOpening?.();
    });

    if (this._options.deferShow) {
      requestAnimationFrame(() => {
        // Closed again (or torn down) before the frame landed.
        if (this._phase() === 'opening') {
          this.showNow();
        }
      });
      return;
    }
    this.showNow();
  }

  /**
   * Closes the overlay. No-op when already closed or closing.
   *
   * @param options `silent` skips the `closing` emit — for closes the consumer asked
   * for programmatically and does not want echoed back.
   */
  public hide(options?: { silent?: boolean }): void {
    if (this._phase() === 'closed' || this._phase() === 'closing') {
      return;
    }
    this._phase.set('closing');
    this.startClosing(options?.silent === true);

    if (!this._options.deferHide) {
      this.hideNow();
    }
    this.awaitExitAnimation(this.animationElement());
  }

  /** Opens or closes, whichever the current phase is not. */
  public toggle(): void {
    if (this.isOpen()) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Feed the host's native `toggle` event in so light dismiss, Escape and
   * `popovertarget` land in the machine instead of desynchronising it.
   */
  public onNativeToggle(event: Event): void {
    const newState = (event as ToggleEvent).newState;
    if (newState === 'open') {
      if (this._phase() !== 'open') {
        this._phase.set('open');
        this._hasBeenOpened.set(true);
        this.markOpened();
      }
      return;
    }
    if (this._phase() === 'closed' || this._phase() === 'closing') {
      return;
    }
    // Closed by the user, not by us — the element already left the top layer.
    this._phase.set('closing');
    this.startClosing(false);
    this.awaitExitAnimation(this.animationElement());
  }

  /** The host's native `<dialog>` `close` event. */
  public onNativeClose(): void {
    this.onNativeToggle({ newState: 'closed' } as ToggleEvent);
  }

  private hideNow(): void {
    const element = this.attachedElement();
    if (!element) {
      return;
    }
    if (this._options.mode() === 'modal') {
      (element as HTMLDialogElement).close();
    } else if (element.hasAttribute('popover')) {
      // Dropped its attribute already, or never had one — nothing native to hide.
      element.togglePopover(false);
    }
  }

  private showNow(): void {
    const element = this.attachedElement();
    if (!element) {
      this._phase.set('closed');
      return;
    }
    const mode = this._options.mode();
    this.applyPopoverAttribute(element, mode);
    this.notify(this._options.onBeforeShow);

    if (mode === 'modal') {
      (element as HTMLDialogElement).showModal();
    } else {
      // togglePopover over showPopover: a reopen during a deferred hide would still be
      // showing, and showPopover throws on that.
      element.togglePopover(true);
    }

    this._phase.set('open');
    this.markOpened();
  }

  /** Phase reached `open`: the model is already in step, so just let the control react. */
  private markOpened(): void {
    this.notify(() => {
      this._options.control?.open.set(true);
      this._options.onOpened?.();
    });
  }

  /** Phase entered `closing`: sync the control's model and emit `closing`. */
  private startClosing(silent: boolean): void {
    this.notify(() => {
      const control = this._options.control;
      control?.open.set(false);
      if (!silent) {
        control?.closing?.emit();
      }
      this._options.onClosing?.();
    });
  }

  /**
   * The attribute exists only while the overlay does. It has to be in place *before*
   * the show call — a binding may not have flushed by then.
   */
  private applyPopoverAttribute(element: HTMLElement, mode: OverlayMode): void {
    if (mode === 'modal') {
      element.removeAttribute('popover');
      return;
    }
    const value =
      mode === 'hint'
        ? 'hint'
        : mode === 'manual'
          ? 'manual'
          : (this._options.popoverValue?.() ?? 'auto');
    element.setAttribute('popover', value);
  }

  /**
   * Waits out the exit animation, then lands in `closed`.
   *
   * `allSettled`, because a cancelled animation rejects and swallowing that would
   * strand the overlay half-closed forever. Only animations that are running *and*
   * finite are awaited — a spinner in projected content loops forever, a paused or
   * idle one never resolves either, and with {@link OverlayLifecycleOptions.deferHide}
   * that would leave the overlay visible for good. A freshly started CSS animation
   * already reports `running` (its `pending` flag covers the not-yet-first-frame gap),
   * so the real exit animation is never skipped.
   */
  private awaitExitAnimation(element: HTMLElement | null): void {
    const finish = () => {
      // Reopened while the animation ran — this close is stale. Destroyed meanwhile —
      // emitting an output from here would warn (NG0953).
      if (this._destroyed || this._phase() !== 'closing') {
        return;
      }
      if (this._options.deferHide) {
        this.hideNow();
      }
      this._phase.set('closed');
      const current = this.attachedElement();
      if (current && this._options.mode() !== 'modal') {
        current.removeAttribute('popover');
      }
      this._options.control?.closed?.emit();
      this._options.onClosed?.();
    };

    if (!element || typeof element.getAnimations !== 'function') {
      finish();
      return;
    }
    requestAnimationFrame(() => {
      const pending = element
        .getAnimations({ subtree: this._options.awaitSubtree === true })
        .filter(
          animation =>
            animation.playState === 'running' &&
            animation.effect?.getTiming().iterations !== Infinity
        )
        .map(animation => animation.finished);
      void Promise.allSettled(pending).then(finish);
    });
  }

  /** Callbacks emit component outputs — never fire one after the host is gone (NG0953). */
  private notify(callback: (() => void) | undefined): void {
    if (!this._destroyed) {
      callback?.();
    }
  }

  /** The element whose animations gate the close, defaulting to the overlay itself. */
  private animationElement(): HTMLElement | null {
    if (this._destroyed) {
      return null;
    }
    const element = this._options.animationElement?.() ?? this._element();
    return element?.isConnected ? element : null;
  }

  /** Native overlay APIs throw on detached elements, so a stale reference no-ops. */
  private attachedElement(): HTMLElement | null {
    if (this._destroyed) {
      return null;
    }
    const element = this._element();
    return element?.isConnected ? element : null;
  }
}
