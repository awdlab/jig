export function upsertThemeStyleElement(
  document: Document,
  identifiers: Record<string, string | undefined>,
  css: string
): HTMLStyleElement {
  let selector = '';
  for (const key in identifiers) {
    if (identifiers[key] === undefined) continue;
    selector += `[data-${key}="${identifiers[key]}"]`;
  }
  if (!selector) throw new Error('No identifiers provided for the style element');

  let styleElement = document.head.querySelector<HTMLStyleElement>(`style[ngn-style]${selector}`);
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.setAttribute('ngn-style', '');
    for (const key in identifiers) {
      if (identifiers[key] === undefined) continue;
      styleElement.setAttribute(`data-${key}`, identifiers[key]);
    }
    document.head.appendChild(styleElement);
  }
  styleElement.innerHTML = css;

  return styleElement;
}
