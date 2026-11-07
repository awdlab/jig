import { createControlTemplate } from '@awdlab/jig-themes/api';

export const scrollShadowDirectiveTemplate = createControlTemplate({
  scope: 'scroll-shadow',
  classNames: [
    'root',
    'scrolled-start',
    'scrolled-end',
    'scrolled-top',
    'scrolled-bottom',
    // Overlay layer the directive injects; `unstyled` hides it for consumers painting their own shadows.
    'overlay',
    'surface',
    'unstyled',
  ],
});
