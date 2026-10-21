export function upsertThemeStyleElement(
  document: Document,
  identifiers: Record<string, string | undefined>,
  css: string,
  nonce?: string
): HTMLStyleElement {
  let selector = '';
  for (const key in identifiers) {
    if (identifiers[key] === undefined) continue;
    selector += `[data-${key}="${identifiers[key]}"]`;
  }
  if (!selector) throw new Error('No identifiers provided for the style element');

  let styleElement = document.head.querySelector<HTMLStyleElement>(`style[jig-style]${selector}`);
  const isNew = !styleElement;
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.setAttribute('jig-style', '');
    for (const key in identifiers) {
      if (identifiers[key] === undefined) continue;
      styleElement.setAttribute(`data-${key}`, identifiers[key]);
    }
    if (nonce) styleElement.setAttribute('nonce', nonce);
  }
  styleElement.textContent = css;
  // Appended last: a nonce only counts if it is set before the element enters the DOM.
  if (isNew) document.head.appendChild(styleElement);

  return styleElement;
}
