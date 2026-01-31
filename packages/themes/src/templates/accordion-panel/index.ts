import { createControlTemplate } from '@ngneers/controls-themes/api';

export const accordionPanelControlTemplate = createControlTemplate({
  scope: 'accordion-panel',
  classNames: [
    'root',
    'header',
    'header-disabled',
    'header-text',
    'content-expander',
    'content-expander-collapsed',
    'content',
  ],
});
