import {
  afterNextRender,
  booleanAttribute,
  DestroyRef,
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
 * Setting {@link JigAutofocus.jigAutofocus} to `false` releases the latch, so
 * toggling it back to `true` focuses again.
 *
 * @category directive
 */
@Directive({ selector: '[jigAutofocus]' })
export class JigAutofocus {
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
  private readonly _focused = signal(false);
  private readonly _isInitialized = signal(false);
  private _frame = 0;

  /**
   * Whether to focus the host element once it has rendered. Set to `false` to
   * disable autofocus without removing the directive.
   * @default true
   */
  public readonly jigAutofocus = input(true, { transform: booleanAttribute });

  constructor() {
    effect(() => {
      if (!this.jigAutofocus()) {
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
     */
    afterNextRender(() => this._isInitialized.set(true));

    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this._frame));
  }

  private autoFocus() {
    cancelAnimationFrame(this._frame);
    if (!this._isInitialized()) {
      return;
    }
    if (!this.jigAutofocus()) {
      return;
    }
    if (this._focused()) {
      return;
    }
    const element = this._el.nativeElement;
    // `focus()` on a host that is not rendered yet is a silent no-op: controls are
    // `display: none` while initializing, and a popover stays `visibility: hidden` until
    // it has been positioned. Wait for it to render instead of assuming it has.
    if (element.isConnected && !element.checkVisibility({ visibilityProperty: true })) {
      this._frame = requestAnimationFrame(() => this.autoFocus());
      return;
    }
    element.focus();
    this._focused.set(true);
  }
}
