/**
 * Shared shadcn-style focus ring for interactive shade parts.
 *
 * `focusRingSetup(v)` defines `--shade-shadow` (resting elevation) and `--shade-ring` (ring color),
 * which kinds or states may override; `focusRingStyles(v)` draws the 3px ring on top of that shadow.
 */
export function focusRingSetup(v: (varName: 'color.ring') => string): string {
  return `
    /* transparent no-op layer, never 'none' — must participate in the layered box-shadow list */
    --shade-shadow: 0 0 #0000;
    --shade-ring: ${defaultRing(v)};
  `;
}

/** The ring declarations, for parts whose focus selector isn't the element's own `:focus-visible`. */
export function focusRingStyles(v: (varName: 'color.ring') => string): string {
  return `
    /* transparent normally; system-colored under forced-colors, where box-shadow doesn't render */
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow:
      0 0 0 3px var(--shade-ring, ${defaultRing(v)}),
      var(--shade-shadow, 0 0 #0000);
  `;
}

/** The ring as a nested `&:focus-visible` rule. */
export function focusRing(v: (varName: 'color.ring') => string): string {
  return `
    &:focus-visible {
      ${focusRingStyles(v)}
    }
  `;
}

function defaultRing(v: (varName: 'color.ring') => string): string {
  return `color-mix(in srgb, ${v('color.ring')} 50%, transparent)`;
}
