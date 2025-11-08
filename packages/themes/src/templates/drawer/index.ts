import { createControlTemplate } from '@ngneers/controls-themes/api';

export const drawerControlTemplate = createControlTemplate({
  scope: 'drawer',
  classNames: [
    'horizontal',
    'content',
    'header',
    'footer',
    'default-header',
    'default-header-text',
  ],
});
