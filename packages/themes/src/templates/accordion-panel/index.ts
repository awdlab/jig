import { createControlTemplate } from '@awdlab/jig-themes/api';

export const accordionPanelControlTemplate = createControlTemplate({
  scope: 'accordion-panel',
  classNames: [
    'root',
    'header',
    'header-expanded',
    'header-disabled',
    'header-text',
    'content-expander',
    'content-expander-collapsed',
    'content',
  ],
});
