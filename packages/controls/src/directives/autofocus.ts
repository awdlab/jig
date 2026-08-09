import {
  afterNextRender,
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

/**
 * Focuses its host element once, after the first browser render.
 *
 * The focus is latched: it fires on the first render where the host is
 * displayed and never again, so re-showing the element does not re-focus it.
 * Setting {@link NgnAutofocus.ngnAutofocus} to `false` releases the latch, so
 * toggling it back to `true` focuses again.
 *
 * @category directive
 */
@Directive({ selector: '[ngnAutofocus]' })
export class NgnAutofocus {
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
  private readonly _focused = signal(false);
  private readonly _isInitialized = signal(false);

  /**
   * Whether to focus the host element once it has rendered. Set to `false` to
   * disable autofocus without removing the directive.
   * @default true
   */
  public readonly ngnAutofocus = input(true, { transform: booleanAttribute });

  constructor() {
    effect(() => {
      if (!this.ngnAutofocus()) {
        this._focused.set(false);
      }
    });
    effect(() => {
      this.autoFocus();
    });

    /**
     * `afterNextRender` only runs in the browser, never during server-side
     * prerendering — guarding against `getClientRects`/`focus` calls on a
     * server DOM element that lacks them.
     *
     * The additional microtask ensures that the control is rendered and the
     * awd-control-initializing class is removed before trying to focus the element.
     */
    afterNextRender(() => {
      if (this._el.nativeElement.getClientRects().length === 0) {
        queueMicrotask(() => {
          this._isInitialized.set(true);
        });
      } else {
        this._isInitialized.set(true);
      }
    });
  }

  private autoFocus() {
    if (!this._isInitialized()) {
      return;
    }
    if (!this.ngnAutofocus()) {
      return;
    }
    if (this._focused()) {
      return;
    }
    this._el.nativeElement.focus();
    this._focused.set(true);
  }
}
