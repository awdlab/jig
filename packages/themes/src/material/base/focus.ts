/** Outline focus ring for interactive material parts; `color` tints it (defaults to primary). */
export function focusRing(
  v: (name: 'color.primary.500') => string,
  color = v('color.primary.500')
): string {
  return `
    outline: 2px solid color-mix(in srgb, ${color} 50%, transparent);
    outline-offset: 2px;
  `;
}
