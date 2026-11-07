/** Ring for a focused field. */
export function fieldRing(v: (name: 'color.primary.500' | 'ring.alpha') => string): string {
  return `color-mix(in oklab, ${v('color.primary.500')} ${v('ring.alpha')}, transparent)`;
}

/** Ring for a focused field in the invalid state — never a solid band. */
export function fieldInvalidRing(v: (name: 'color.error.500' | 'ring.alpha') => string): string {
  return `color-mix(in oklab, ${v('color.error.500')} ${v('ring.alpha')}, transparent)`;
}

/** Ring for a focused field that can't be edited (read-only) — neutral, same weight as the others. */
export function fieldNeutralRing(
  v: (name: 'color.disabled.border' | 'ring.alphaNeutral') => string
): string {
  return `color-mix(in oklab, ${v('color.disabled.border')} ${v('ring.alphaNeutral')}, transparent)`;
}
