import { createControlTemplate } from '@awdlab/jig-themes/api';

export const drawerControlTemplate = createControlTemplate({
  scope: 'drawer',
  classNames: [
    'root',
    'horizontal',
    'content',
    'header',
    'footer',
    'default-header',
    'default-header-text',
    'anim-in',
    'anim-out',
  ],
});
