const listeners = new Set<() => void>();

/**
 * Register imperative work to redo whenever the direction changes, returning an
 * unregister function.
 *
 * A plain callback rather than an `effect`, for two reasons: callers such as the
 * auto-positioning handle are created inside `computed`s, where creating an
 * effect is illegal; and direction is read per element with {@link isRtl} at the
 * point of use, which keeps `getComputedStyle` out of the reactive graph where it
 * would force a style recalc mid-render.
 */
export function onDirectionChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Call after changing `dir`/`direction` at runtime so that already-open
 * overlays re-resolve their placement. Not needed when the direction is set
 * once at bootstrap, nor for anything styled with logical properties or
 * `:dir()` — CSS re-matches on its own.
 */
export function notifyDirectionChanged(): void {
  // Snapshotted because Set iteration is live: a listener that unregisters a
  // sibling mid-walk would otherwise skip it.
  for (const listener of Array.from(listeners)) {
    listener();
  }
}

/**
 * Whether `el` renders right-to-left, read from its inherited CSS `direction`.
 * Resolves per subtree, so a `dir="rtl"` island inside an LTR page answers
 * correctly. Call it at the point of use (a keydown, a pointerdown, a position
 * computation) rather than caching it in a signal.
 */
export function isRtl(el: Element): boolean {
  return getComputedStyle(el).direction === 'rtl';
}

/**
 * Resolve a horizontal arrow key into a step along the inline axis, relative to
 * `el`'s writing direction: `1` moves toward the inline-end (forward), `-1`
 * toward the inline-start. Returns `0` for any other key.
 *
 * Use this instead of branching on `ArrowRight`/`ArrowLeft` directly, so
 * "forward" keeps meaning forward when the direction flips.
 */
export function inlineArrowStep(el: Element, key: string): -1 | 0 | 1 {
  if (key !== 'ArrowLeft' && key !== 'ArrowRight') {
    return 0;
  }
  const forward = isRtl(el) ? 'ArrowLeft' : 'ArrowRight';
  return key === forward ? 1 : -1;
}
