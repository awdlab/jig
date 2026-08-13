import { createControlTemplate } from '@awdlab/jig-themes/api';

export const tabsControlTemplate = createControlTemplate({
  scope: 'tabs',
  classNames: [
    'root',
    'headers-container',
    'headers',
    'header',
    'header-active',
    'header-active-indicator',
    'scroll-start',
    'scroll-end',
    'content',
  ],
});
