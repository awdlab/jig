/**
 * Shared shadcn-style focus-ring pattern for interactive shade parts.
 *
 * Contract: `focusRingSetup(v)` goes at the top of a part's root class and defines two
 * custom properties that kinds (or states) may override:
 * - `--shade-shadow`: the resting elevation shadow (defaults to a no-op layer). Kinds opt
 *   into elevation by setting it, e.g. `--shade-shadow: ${v('shadow.sm')};`, and should
 *   render it via `box-shadow: var(--shade-shadow);`.
 * - `--shade-ring`: the focus ring color (defaults to `color.ring` at 50%). Override for
 *   deviating rings, e.g. a destructive kind at 20%.
 *
 * `focusRing` is the matching nested `&:focus-visible` rule that layers the 3px ring on
 * top of the elevation shadow. Interpolate it inside the same root class.
 */
export function focusRingSetup(v: (varName: 'color.ring') => string): string {
  return `
    /* transparent no-op layer, never 'none' — must participate in the layered box-shadow list */
    --shade-shadow: 0 0 #0000;
    --shade-ring: color-mix(in srgb, ${v('color.ring')} 50%, transparent);
  `;
}

export const focusRing = `
  &:focus-visible {
    /* transparent normally; system-colored under forced-colors, where box-shadow doesn't render */
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow:
      0 0 0 3px var(--shade-ring),
      var(--shade-shadow);
  }
`;
