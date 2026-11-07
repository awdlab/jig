import { createControlTemplate } from '@awdlab/jig-themes/api';

export const toastControlTemplate = createControlTemplate({
  scope: 'toast',
  classNames: [
    'root',
    'host',
    'anim-enter',
    'anim-leave',
    'default-header',
    'default-header-text',
    'default-content',
    'color-*',
  ],
});
