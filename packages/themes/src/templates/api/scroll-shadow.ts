import { createControlTemplate } from '@ngneers/controls-themes/api';

export const scrollShadowDirectiveTemplate = createControlTemplate({
  scope: 'scrollShadow',
  classNames: ['root', 'scrolled-start', 'scrolled-end', 'scrolled-top', 'scrolled-bottom'],
});
