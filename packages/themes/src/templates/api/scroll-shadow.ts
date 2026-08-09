import { createControlTemplate } from '@awdlab/jig-themes/api';

export const scrollShadowDirectiveTemplate = createControlTemplate({
  scope: 'scrollShadow',
  classNames: [
    'root',
    'scrolled-start',
    'scrolled-end',
    'scrolled-top',
    'scrolled-bottom',
    // Generic edge-shadow overlay the directive injects into the scroll container. `overlay` is a
    // zero-size sticky layer pinned to the viewport corner; `surface` is the sized cover whose
    // edge gradients paint the active edges. `unstyled` (via `jigScrollShadowUnstyled`) marks the
    // overlay so the theme hides it — for consumers that paint their own shadows off the
    // `scrolled-*` classes (e.g. the table's sticky-column edges).
    'overlay',
    'surface',
    'unstyled',
  ],
});
