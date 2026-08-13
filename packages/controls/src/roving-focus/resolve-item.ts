import { computed, isSignal, type Signal } from '@angular/core';

const FOCUSABLE_SELECTOR = 'button, a[href], input, select, textarea, [tabindex]';

/**
 * Resolve the element that should own the roving tab stop for a projected
 * control. The control's host is the focusable element for a native
 * `button[jigButton]`/`a[jigButton]`; for wrapper controls like
 * `jig-toggle-button` the real tab stop is a focusable descendant.
 */
export function resolveFocusable(host: HTMLElement): HTMLElement {
  if (host.matches(FOCUSABLE_SELECTOR)) return host;
  return host.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? host;
}

/**
 * Reactive disabled flag for a projected control so roving navigation skips it.
 * Prefer the control's own `disabled` signal (e.g. `jig-toggle-button`); fall
 * back to reflecting the focusable element's native `disabled`/`aria-disabled`
 * for plain `button[jigButton]`, which has no such signal.
 */
export function resolveDisabled(ref: object, element: HTMLElement): Signal<boolean> {
  const controlDisabled = (ref as { disabled?: unknown }).disabled;
  if (isSignal(controlDisabled)) {
    return controlDisabled as Signal<boolean>;
  }
  return computed(
    () => element.matches(':disabled') || element.getAttribute('aria-disabled') === 'true'
  );
}
