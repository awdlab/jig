import { computed, isSignal, type Signal } from '@angular/core';

const NATIVE_FOCUSABLE_SELECTOR = 'button, a[href], input, select, textarea';

/**
 * Resolve the element that should own the roving tab stop for a projected
 * control. The control's host is the focusable element for a native
 * `button[jigButton]`/`a[jigButton]`; for wrapper controls like
 * `jig-toggle-button` the real tab stop is a focusable descendant.
 *
 * A control built from `tabindex` rather than a native element resolves to its
 * innermost such element: `jig-input-field` carries a `tabindex` of its own but
 * only forwards focus to the control it wraps, so the wrapper is never the stop.
 * The check is structural on purpose — roving rewrites the tabindex values of
 * everything it owns, so a rule reading those values would not survive a re-run.
 *
 * `undefined` when the control has nothing focusable — a decorative `jig-icon`
 * is a control, not a tab stop, and giving its host a tabindex would make it one.
 */
export function resolveFocusable(host: HTMLElement): HTMLElement | undefined {
  if (host.matches(NATIVE_FOCUSABLE_SELECTOR)) return host;
  const native = host.querySelector<HTMLElement>(NATIVE_FOCUSABLE_SELECTOR);
  if (native) return native;
  const candidates = [...host.querySelectorAll<HTMLElement>('[tabindex]')];
  const innermost = candidates.find(
    candidate => !candidates.some(other => other !== candidate && candidate.contains(other))
  );
  return innermost ?? (host.matches('[tabindex]') ? host : undefined);
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
