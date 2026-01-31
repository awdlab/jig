import { createControlTemplate } from '@ngneers/controls-themes/api';

export const tabsControlTemplate = createControlTemplate({
  scope: 'tabs',
  classNames: [
    'root',
    'headers-container',
    'headers',
    'header',
    'header-active',
    'header-active-indicator',
    'scroll-left',
    'scroll-right',
    'content',
  ],
});
